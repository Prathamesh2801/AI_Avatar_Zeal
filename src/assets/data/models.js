import Male1 from "../img/model/male1.jpg";
import Male2 from "../img/model/male2.jpg";
import Male3 from "../img/model/male3.jpg";
import Male4 from "../img/model/male4.jpg";
import Female1 from "../img/model/female1.jpg";
import Female2 from "../img/model/female2.jpg";
import Female3 from "../img/model/female3.jpg";
import Female4 from "../img/model/female4.jpg";

// Model ids are the contract with the face-swap backend and are sent as-is
// (`model_id`). Male templates are the 100 block, female the 200 block, so a
// new template just takes the next free number in its block.
//
// Slots line up across genders: 101/201 are the same pose, 102/202, and so on.
// Source art is 2:3 (4:6), matching the printed output — keep new templates at
// that ratio so what the user picks is what gets printed.
export const models = [
  { id: 101, category: "male", name: "Sky Guardian", image: Male1 },
  { id: 102, category: "male", name: "Digital Protector", image: Male2 },
  { id: 103, category: "male", name: "Shield Bearer", image: Male3 },
  { id: 104, category: "male", name: "Claim Investigator", image: Male4 },

  { id: 201, category: "female", name: "Sky Guardian", image: Female1 },
  { id: 202, category: "female", name: "Digital Protector", image: Female2 },
  { id: 203, category: "female", name: "Shield Bearer", image: Female3 },
  { id: 204, category: "female", name: "Claim Investigator", image: Female4 },
];

export const getModelsByGender = (gender) =>
  models.filter((m) => m.category === gender);

export const getModelById = (id) => models.find((m) => m.id === Number(id));
