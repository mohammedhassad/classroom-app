const create = async (params, credentials, course) => {
  console.log(course.get("name"));
  try {
    let response = await fetch("/api/courses/by/" + params.userId, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + credentials.jwt,
      },
      body: course,
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

const getCourses = async (signal) => {
  try {
    let response = await fetch("/api/courses/", {
      method: "GET",
      signal: signal,
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const getCourse = async (params, signal) => {
  try {
    let response = await fetch("/api/courses/" + params.courseId, {
      method: "GET",
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const updateCourse = async (params, credentials, course) => {
  try {
    let response = await fetch("/api/courses/" + params.courseId, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + credentials.jwt,
      },
      body: course,
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const deleteCourse = async (params, credentials) => {
  try {
    let response = await fetch("/api/courses/" + params.courseId, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.jwt,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const listByInstructor = async (params, credentials, signal) => {
  try {
    let response = await fetch("/api/courses/by/" + params.userId, {
      method: "GET",
      signal: signal,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + credentials.jwt,
      },
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

const createLesson = async (params, credentials, lesson) => {
  try {
    let response = await fetch(
      "/api/courses/" + params.courseId + "/lesson/create",
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.jwt,
        },
        body: JSON.stringify({ lesson: lesson }),
      }
    );
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

const listPublished = async (signal) => {
  try {
    let response = await fetch("/api/courses/published", {
      method: "GET",
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export {
  create,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  listByInstructor,
  createLesson,
  listPublished,
};
