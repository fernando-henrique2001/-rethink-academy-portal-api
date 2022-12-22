export type TasksProps = {
  name: string;
  description: string;
  taskDate: string;
  startDate?: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  tags: string;
  status: string;
  userEmail: string;
  duration?: string;
  time?: string;
};

export type TasksPropsUpdate = {
  name?: string;
  description?: string;
  taskDate?: string;
  startTime?: string;
  endTime?: string;
  tags?: string;
  status?: string;
};

const timeKeeper = (time: string) => {
  const interval = time.split(":");
  const realTime = parseInt(interval[0]) * 60 + parseInt(interval[1]);
  return realTime;
};

const convertTime = (time: number) => {
  let hours = time / 60;
  let minutes = time % 60;

  const timeConvert = {
    hours: Math.trunc(hours),
    minutes: minutes,
  };

  return timeConvert;
};

const timeToString = (time: number) => {
  let hours = Math.trunc(time / 60);
  let minutes = time % 60;

  return `${hours}h${minutes < 10 ? "0" + minutes : minutes}`;
};

const addDayToEndDate = (transform: Date) => {
  let data = new Date(transform);
  data.setDate(data.getDate() + 1);
  return data;
};

const monthLibrary = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const convertMonth = (date: string) => {
  let helper = date.split("T");
  let date2 = helper[0].split("-");

  let day = date2[2];
  let month = monthLibrary[Number(date2[1]) - 1];

  return `${day} de ${month}`;
};

const composeDate = (day: string, month: string, year: string) => {
  return new Date(`${year}-${month}-${day}`);
};

export {
  composeDate,
  timeKeeper,
  convertMonth,
  addDayToEndDate,
  timeToString,
  convertTime,
};
