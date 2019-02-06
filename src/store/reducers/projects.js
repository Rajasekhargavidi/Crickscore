const initialState = {
  projects: []
};
const projects = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_PROJECT":
      console.log(action.project);
      return state;
      break;
    default:
      return state;
  }
};

export default projects;
