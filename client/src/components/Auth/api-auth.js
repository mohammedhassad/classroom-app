const signup = async (user) => {
  try {
    let res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const signin = async (user) => {
  try {
    let res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const signout = async (credentials) => {
  try {
    let res = await fetch("/api/auth/signout", {
      method: "GET",
      headers: { authorization: `Bearer ${credentials.jwt}` },
    });

    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

export { signup, signin, signout };
