import PocketBase from "./node_modules/pocketbase/dist/pocketbase.es.mjs";

const URL = "https://deorum.fly.dev";
const client = new PocketBase(URL);

// fetch a paginated records list
const resultList = await client.records.getList("portraits", 1, 50, {
  filter: 'created >= "2022-01-01 00:00:00"'
});

console.log(resultList);

const gallery = resultList.items.map(item => {
  const src = `${URL}/api/files/${item["@collectionId"]}/${item.id}/${item.image}`;
  return `<img alt=${item.original} id="${item.id}" src=${src} />`;
});

const section = document.querySelector("section");
section.innerHTML = gallery.join("");
