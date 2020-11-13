import React from "react";
import useSWR from "swr";
import { ListGroup } from "react-bootstrap";
import { CourseForm } from "./CourseForm";
import { CourseItem } from "./CourseItem";
import { CourseHeader } from "./CourseHeader";
import { fetchWithToken } from "main/utils/fetch";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "main/components/Loading/Loading";
import { sortCourses } from "../../utils/courseHelpers";

const CourseList = () => {
  const { user, getAccessTokenSilently: getToken } = useAuth0();
  const { data: courseList, error, mutate: mutateCourses } = useSWR(
    ["/api/courses", getToken],
    fetchWithToken
  );
  if (error) {
    return (
      <h1>We encountered an error; please reload the page and try again.</h1>
    );
  }
  if (!courseList) {
    return <Loading />;
  }
  const updateCourse = async (item, id) => {
    await fetchWithToken(`/api/courses/${id}`, getToken, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(item),
    });
    await mutateCourses();
  };
  const deleteCourse = async (id) => {
    await fetchWithToken(`/api/courses/${id}`, getToken, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      noJSON: true,
    });
    await mutateCourses();
  };

  const saveCourse = async (courseText1, courseText2, courseText3, courseText4, courseText5) => {
    await fetchWithToken(`/api/courses/`, getToken, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: courseText1,
        quarter: courseText2,
        instructorFirstName: courseText3,
        instructorLastName: courseText4,
        instructorEmail: courseText5,
      }),
    });
    await mutateCourses();
  };
  var items = sortCourses(courseList).map((item, index) => {
    console.log(item);
    return (
      <CourseItem
        key={item.id}
        item={item}
        index={index}
        updateCourse={updateCourse}
        deleteCourse={deleteCourse}
      />
    );
  });

  return (
    <>
      <CourseHeader name={user.name} />
      <CourseForm addCourse={saveCourse} />
      <ListGroup> {items} </ListGroup>
    </>
  );
};

export default CourseList;




// import React from "react";
// import { Jumbotron } from "react-bootstrap";
// const Courses = () => {
//   return (
//     <Jumbotron>
//       <h1>This is 127.0.0.1 (aka home)</h1>
//       <div className="text-left">
//         <p>Course List Page</p>
//       </div>
//     </Jumbotron>
//   );
// };

// export default Courses;