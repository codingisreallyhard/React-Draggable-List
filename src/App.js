import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ref, set, onValue } from "firebase/database";
import Card from "react-bootstrap/Card";
import "./App.css";

import { initializeApp } from "firebase/app";

import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA026QVwkOCo34hx65sHjBeLCfkxYdwvMQ",
  authDomain: "experimentor-assignment.firebaseapp.com",
  databaseURL: "https://experimentor-assignment-default-rtdb.firebaseio.com/",
  projectId: "experimentor-assignment",
  storageBucket: "experimentor-assignment.appspot.com",
  messagingSenderId: "441214950763",
  appId: "1:441214950763:web:a2d7dd06b870e213f6802e",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const DraggableList = () => {
  const [data, setData] = useState([]);
  const db = getDatabase();

  // Fetch data from DB
  useEffect(() => {
    const dataRef = ref(db, "People");
    onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(Object.values(snapshot.val()));
      }
    });
  }, [db]);

  // Drag event logic

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updatedData = [...data];
    const [reorderedItem] = updatedData.splice(result.source.index, 1);
    updatedData.splice(result.destination.index, 0, reorderedItem);
    setData(updatedData);

    const dataRef = ref(db, "People");
    set(dataRef, updatedData);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <h1 className="title_center">People</h1>
            {data.map((item, index) => (
              <Draggable
                key={item.id}
                draggableId={item.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Card body align="center">
                      {item.name}
                      <img
                        src={item.imageRef}
                        alt="person"
                        className="card_class"
                      />
                    </Card>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableList;
