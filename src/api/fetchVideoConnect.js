export function createTVEventConnection({
  url,
  onPlay,
  onText,
  onPing,
  onStatus,
  debug = false,
}) {
  let es = null;

  const log = (...args) => debug && console.log("[SSE]", ...args);

  const connect = () => {
    if (es) return;

    log("Connecting to", url);
    onStatus?.("connecting");

    es = new EventSource(url);

    es.onopen = () => {
      log("Connected");
      onStatus?.("connected");
    };

    es.onerror = (err) => {
      // DO NOT close — browser retries automatically
      log("SSE error (retrying automatically)", err);
      onStatus?.("reconnecting");
    };

    es.addEventListener("ping", (e) => {
      onPing?.(JSON.parse(e.data));
    });

    es.addEventListener("Play", (e) => {
      const data = JSON.parse(e.data)?.[0];
      log("Play event", data);
      onPlay?.(data);
    });

    es.addEventListener("Text", (e) => {
      const data = JSON.parse(e.data)?.[0];
      log("Text event", data);
      onText?.(data);
    });
  };

  const disconnect = () => {
    if (es) {
      log("Closing connection");
      es.close();
      es = null;
    }
  };

  return { connect, disconnect };
}
