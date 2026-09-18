# Server fix: duplicated CORS headers on `api.php`

**Symptom:** the browser shows `CORS error` on `POST /api.php` and the app says
"Could not reach the server", even though the request reaches the server, the
photo is processed and the server returns `200 OK` with valid JSON.

## Cause

Both Apache **and** the PHP script are sending the CORS headers, so each one
arrives twice:

```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *                            <- Apache (.htaccess / vhost)
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
X-Powered-By: PHP/8.3.26                                  <- PHP output starts here
Access-Control-Allow-Origin: *                            <- api.php header() calls
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

The CORS spec allows **exactly one** `Access-Control-Allow-Origin`. When a
response carries two — even with identical values — the browser treats it as
invalid and blocks the response from JavaScript. The request still ran on the
server, which is why images are generated but the app never sees the reply.

Static files are already correct: `Final/*.png` returns a single set of headers
(from Apache only), so image downloads work.

## Fix — remove one of the two sources

Apache's rule already covers both the PHP endpoint and the static images, so the
simplest fix is to **drop the header calls from PHP**.

In `api.php`, delete (or comment out) lines like:

```php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
```

Keep whatever `OPTIONS` preflight short-circuit the script has, e.g.:

```php
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
```

### Alternative

If the PHP headers must stay, stop Apache adding its own for PHP instead — but
keep it for the images, which need it for downloads to work:

```apache
<IfModule mod_headers.c>
  # images only; PHP sets its own
  <FilesMatch "\.(png|jpe?g|webp)$">
    Header set Access-Control-Allow-Origin "*"
  </FilesMatch>
</IfModule>
```

Note `Header set` (not `add`) — `add` appends another copy and recreates this
same bug.

## Verify

Each header must appear exactly **once**:

```bash
curl -s -D - -o /dev/null -X POST \
  -H "Origin: http://localhost:5173" \
  -F "id=101" -F "source=@photo.jpg" \
  http://192.168.1.13/ministack/HDFC_QUIZ/api.php | grep -i access-control
```

Expected: one `Access-Control-Allow-Origin` line. Two means it is not fixed.

Same check for an image (already passing):

```bash
curl -sI http://192.168.1.13/ministack/HDFC_QUIZ/Final/<file>.png | grep -i access-control
```
