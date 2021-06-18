const create = async (params, credentials) => {
  try {
    let response = await fetch("/api/enrollment/new/" + params.courseId, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${credentials.jwt}`,
      },
    });

    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const listEnrolled = async (credentials, signal) => {
  try {
    let response = await fetch("/api/enrollment/enrolled", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${credentials.jwt}`,
      },
      signal: signal,
    });

    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const enrollmentStats = async (params, credentials, signal) => {
  try {
    let response = await fetch("/api/enrollment/stats/" + params.courseId, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${credentials.jwt}`,
      },
      signal: signal,
    });

    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const getEnrollment = async (params, credentials, signal) => {
  try {
    let response = await fetch("/api/enrollment/" + params.enrollmentId, {
      method: "GET",
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${credentials.jwt}`,
      },
    });

    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const complete = async (params, credentials, enrollment) => {
  try {
    let response = await fetch(
      "/api/enrollment/complete/" + params.enrollmentId,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${credentials.jwt}`,
        },
        body: JSON.stringify(enrollment),
      }
    );

    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const deleteEnrollment = async (params, credentials) => {
  try {
    let response = await fetch("/api/enrollment/" + params.enrollmentId, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${credentials.jwt}`,
      },
    });

    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export {
  create,
  getEnrollment,
  complete,
  deleteEnrollment,
  listEnrolled,
  enrollmentStats,
};
