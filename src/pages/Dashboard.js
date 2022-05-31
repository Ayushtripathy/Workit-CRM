import { useState, useEffect, useContext } from "react";
import TicketCard from "../components/TicketCard";
// import { tickets } from "../dummy-data";
import CategoriesContext from "../context";
import axios from "axios";

const Dashboard = () => {
  const [tickets, setTickets] = useState(null);
  const { setCategories } = useContext(CategoriesContext);

  useEffect(() => {
    async function fetchData() {
      //Fetch the tasks from api
      const response = await axios.get("http://localhost:8000/tickets");

      //wasn't sure how to get the Documet Id with the object.. open to better suggestions
      const dataObject = response.data.data;

      const arrayOfKeys = Object.keys(dataObject);
      //Convert to array from object
      const arrayOfData = Object.keys(dataObject).map((key) => dataObject[key]);
      const formattedArray = [];
      arrayOfKeys.forEach((key, index) => {
        const formattedData = { ...arrayOfData[index] };
        formattedData["documentId"] = key;
        formattedArray.push(formattedData);
      });

      setTickets(formattedArray);
    }
    fetchData();
  }, []);

  useEffect(() => {
    setCategories([...new Set(tickets?.map(({ category }) => category))]);
  }, [tickets]);

  const colors = [
    "rgb(255,179,186)",
    "rgb(255,223,186)",
    "rgb(255,255,186)",
    "rgb(186,255,201)",
    "rgb(186,225,255)",
  ];

  const uniqueCategories = [
    ...new Set(tickets?.map(({ category }) => category)), //Set is used to get unique categories
  ];

  return (
    <div className="dashboard">
      <h1>My Projects</h1>
      <div className="ticket-container">
        {tickets &&
          uniqueCategories?.map((uniqueCategory, categoryIndex) => (
            <div key={categoryIndex}>
              <h3>{uniqueCategory}</h3>
              {/* Map out the filtered tickets */}
              {tickets
                .filter((ticket) => ticket.category === uniqueCategory)
                .map((filteredTicket, _index) => (
                  <TicketCard
                    key={_index} //Doubt key
                    id={_index}
                    color={colors[categoryIndex] || colors[0]}
                    ticket={filteredTicket}
                  />
                ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Dashboard;
