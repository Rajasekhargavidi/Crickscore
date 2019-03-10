export const extrasJson = [
  {
    type: "wide",
    style:
      "col border border-dark shadow bg-white mx-5 my-1 text-capitalize text-dark",
    selected: false,
    selectedStyle:
      "col border border-dark shadow bg-success text-white mx-5 my-1 text-capitalize",
    extraRun: true,
    ballCounted: false,
    event: "wd",
    disable: [],
    disabled: false,
    id: "wide",
    extra: true,
    batsmanBall: false,
    bowlerBall: false
  },
  {
    type: "no ball",
    style:
      "col border border-dark shadow bg-white mx-5 my-1 text-capitalize text-dark",
    selected: false,
    selectedStyle:
      "col border border-dark shadow bg-success text-white mx-5 my-1 text-capitalize",
    extraRun: true,
    ballCounted: false,
    event: "nb",
    disable: [],
    disabled: false,
    id: "noBall",
    extra: true,
    batsmanBall: true,
    bowlerBall: false
  },
  {
    type: "bye",
    style:
      "col border border-dark shadow bg-white mx-5 my-1 text-capitalize text-dark",
    selected: false,
    selectedStyle:
      "col border border-dark shadow bg-success text-white mx-5 my-1 text-capitalize",
    extraRun: false,
    ballCounted: true,
    event: "b",
    disable: [],
    disabled: false,
    id: "bye",
    extra: true,
    batsmanBall: true,
    bowlerBall: true
  },
  {
    type: "leg bye",
    style:
      "col border border-dark shadow bg-white mx-5 my-1 text-capitalize text-dark",
    selected: false,
    selectedStyle:
      "col border border-dark shadow bg-success text-white mx-5 my-1 text-capitalize",
    extraRun: false,
    ballCounted: true,
    event: "lb",
    disable: [],
    disabled: false,
    id: "legBye",
    extra: true,
    batsmanBall: true,
    bowlerBall: true
  },
  {
    type: "no extra",
    style:
      "col border border-dark shadow bg-white mx-5 my-1 text-capitalize text-dark",
    selected: false,
    selectedStyle:
      "col border border-dark shadow bg-success text-white mx-5 my-1 text-capitalize",
    extraRun: false,
    ballCounted: true,
    event: "",
    disable: [],
    disabled: false,
    id: "noExtra",
    extra: false,
    batsmanBall: true,
    bowlerBall: true
  }
];
export const runsJson = [
  {
    run: 0,
    style: "col current-run bg-white text-dark align-middle mx-2 p-1",
    selected: false,
    selectedStyle:
      "col current-run bg-success text-white align-middle mx-2 p-1",
    id: "zero",
    event: "."
  },
  {
    run: 1,
    style: "col current-run bg-white text-dark align-middle mx-2 p-1",
    selected: false,
    selectedStyle:
      "col current-run bg-success text-white align-middle mx-2 p-1",
    id: "one",
    event: "1"
  },
  {
    run: 2,
    style: "col current-run bg-white text-dark align-middle mx-2 p-1",
    selected: false,
    selectedStyle:
      "col current-run bg-success text-white align-middle mx-2 p-1",
    id: "two",
    event: "2"
  },
  {
    run: 3,
    style: "col current-run bg-white text-dark align-middle mx-2 p-1",
    selected: false,
    selectedStyle:
      "col current-run bg-success text-white align-middle mx-2 p-1",
    id: "three",
    event: "3"
  },
  {
    run: 4,
    style: "col current-run bg-white text-dark align-middle mx-2 p-1",
    selected: false,
    selectedStyle:
      "col current-run bg-success text-white align-middle mx-2 p-1",
    id: "four",
    event: "4"
  },
  {
    run: 5,
    style: "col current-run bg-white text-dark align-middle mx-2 p-1",
    selected: false,
    selectedStyle:
      "col current-run bg-success text-white align-middle mx-2 p-1",
    id: "five",
    event: "5"
  },
  {
    run: 6,
    style: "col current-run bg-white text-dark align-middle mx-2 p-1",
    selected: false,
    selectedStyle:
      "col current-run bg-success text-white align-middle mx-2 p-1",
    id: "six",
    event: "6"
  }
];

export const outJson = [
  {
    type: "out",
    style:
      "col border border-dark shadow bg-white mx-5 my-1 text-capitalize text-dark",
    selected: false,
    selectedStyle:
      "col border border-dark shadow bg-success text-white mx-5 my-1 text-capitalize",
    event: "wk",
    openModal: false,
    disabled: false,
    id: "out",
    out: true,
    bowlerWicket: true
  },
  {
    type: "run out",
    style:
      "col border border-dark shadow bg-white mx-5 my-1 text-capitalize text-dark",
    selected: false,
    selectedStyle:
      "col border border-dark shadow bg-success text-white mx-5 my-1 text-capitalize",
    event: "rwk",
    openModal: true,
    disabled: false,
    id: "runOut",
    out: true,
    bowlerWicket: false
  },
  {
    type: "retired out",
    style:
      "col border border-dark shadow bg-white mx-5 my-1 text-capitalize text-dark",
    selected: false,
    selectedStyle:
      "col border border-dark shadow bg-success text-white mx-5 my-1 text-capitalize",
    event: "rewk",
    openModal: true,
    disabled: false,
    id: "retiredOut",
    out: true,
    bowlerWicket: false
  },
  {
    type: "not out",
    style:
      "col border border-dark shadow bg-white mx-5 my-1 text-capitalize text-dark",
    selected: false,
    selectedStyle:
      "col border border-dark shadow bg-success text-white mx-5 my-1 text-capitalize",
    event: "",
    openModal: false,
    disabled: false,
    id: "notOut",
    out: false,
    bowlerWicket: false
  }
];
