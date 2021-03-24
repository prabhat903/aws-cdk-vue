const baseURL = location.origin;
const getList = async (types) => {
  return await fetch(`${baseURL}/prod/rest`, {
    method: "POST",
    body: JSON.stringify({
      action: "READ",
      payload: {
        types,
      },
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  }).then((response) => response.json());
};

const saveProduct = async (data) => {
  return await fetch(`${baseURL}/prod/rest`, {
    method: "POST",
    body: JSON.stringify({
      action: "WRITE",
      payload: { ...data },
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  }).then((response) => response.json());
};

const removeProduct = async (payload) => {
  return await fetch(`${baseURL}/prod/rest`, {
    method: "POST",
    body: JSON.stringify({
      action: "DELETE",
      payload,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  }).then((response) => response.json());
};
export { getList, saveProduct, removeProduct };
