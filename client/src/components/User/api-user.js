const createUser = async (user) => {};

const getUsers = async (signal) => {
  try {
    let res = await fetch("/api/users", {
      method: "GET",
      signal: signal,
    });

    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const getUser = async (params, credentials, signal) => {
  try {
    let res = await fetch(`/api/users/${params.userId}`, {
      method: "GET",
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: `Bearer ${credentials.jwt}`,
      },
    });

    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const updateUser = async (params, credentials, user) => {
  try {
    let res = await fetch(`/api/users/${params.userId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: `Bearer ${credentials.jwt}`,
      },
      body: JSON.stringify(user),
    });

    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const deleteUser = async (params, credentials) => {
  try {
    let res = await fetch(`/api/users/${params.userId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: `Bearer ${credentials.jwt}`,
      },
    });

    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

export { createUser, getUsers, getUser, updateUser, deleteUser };
