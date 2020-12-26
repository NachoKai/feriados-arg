import { useState, useEffect } from "react";
import axios from "axios";
import "./App.scss";

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const days = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
];

const dayOfWeek = (day, month, year) =>
  days[new Date(year, month, day).getDay()];

const getURL = year => `https://nolaborables.com.ar/api/v2/feriados/${year}`;

const diffDays = (date_1, date_2) => {
  const date1 = new Date(date_1);
  const date2 = new Date(date_2);
  const diffTime = Math.abs(date2 - date1);
  const diff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diff;
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [holiday, setHoliday] = useState("");
  const [diff, setDiff] = useState("");
  const year = new Date().getFullYear();

  useEffect(() => {
    const handleSetHoliday = holidays => {
      const now = new Date();
      const today = {
        day: now.getDate(),
        month: now.getMonth() + 1,
      };

      let holiday = holidays.find(
        h => (h.mes === today.month && h.dia > today.day) || h.mes > today.month
      );

      if (!holiday) {
        holiday = holidays[0];
      }

      setLoading(false);
      setHoliday(holiday);
      setDiff(
        diffDays(
          `${today.month}/${today.day}/${year}`,
          `${holiday.mes}/${holiday.dia}/${year + 1}`
        )
      );
    };

    axios.get(getURL(year)).then(({ data }) => handleSetHoliday(data));
  }, [year]);

  return (
    <div className="container">
      <div className="flag"></div>
      {loading ? (
        <h1 className="loading">Buscando...</h1>
      ) : (
        <a
          href={holiday.info}
          target="_blank"
          rel="noreferrer"
          className="content"
        >
          <div className="title">Próximo feriado</div>
          <div className="quantity">({diff} días)</div>
          <div className="reason">{holiday.motivo}</div>
          <div className="date">
            <div className="weekday">
              {dayOfWeek(holiday.dia, holiday.mes - 1, year)}
            </div>
            <div className="day">{holiday.dia}</div>
            <div className="month">{months[holiday.mes - 1]}</div>
          </div>
          <div className="type">{holiday.tipo}</div>
          {(holiday.opcional || holiday.origen || holiday.religion) && (
            <div className="others">
              <div className="optional">{holiday.opcional}</div>
              <div className="origin">{holiday.origen}</div>
              <div className="religion">{holiday.religion}</div>
            </div>
          )}
        </a>
      )}
    </div>
  );
};

export default App;
