"use client";
import React, { useState } from 'react';

const Store = () => {
  const [items, setItems] = useState(JSON.parse(localStorage.getItem('items')) || []);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [modifier, setModifier] = useState(0);
  const [total, setTotal] = useState(items.reduce((acc, item) => acc + (item.checked ? item.modifier : 0), 0));

  const handleAddItem = () => {
    const newItem = { name, description, modifier: parseInt(modifier), checked: false };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    localStorage.setItem('items', JSON.stringify(updatedItems));
    setName('');
    setDescription('');
    setModifier(0);
  };

  const handleCheckItem = (index) => {
    const updatedItems = [...items];
    updatedItems[index].checked = !updatedItems[index].checked;
    setItems(updatedItems);
    localStorage.setItem('items', JSON.stringify(updatedItems));
    setTotal(updatedItems.reduce((acc, item) => acc + (item.checked ? item.modifier : 0), 0));
  };

const handleRemoveItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
    localStorage.setItem('items', JSON.stringify(updatedItems));
    setTotal(updatedItems.reduce((acc, item) => acc + (item.checked ? item.modifier : 0), 0));
  };

  return (
    <div className='flex flex-col place-items-center store' style={{ fontFamily: '"Press Start 2P", monospace' }}>
      <h1 className="text-xl font-bold m-5">NUMERUS</h1>
      <h1 className="text-xl font-bold m-5">{total >= 0? '+' :'-'}{total}</h1>
      <ul>
        {items.map((item, index) => (
          <li key={index} className="flex flex-row self-stretch items-center justify-between rounded border border-gray-500 px-2 py-1 mx-2 my-1">
            <input className="cb scale-150 p-4 mr-4" type="checkbox" checked={item.checked} onChange={() => handleCheckItem(index)} />
		<span>
            {item.name} {item.description && '-'} {item.description} - {item.modifier}
		</span>
<button onClick={() => handleRemoveItem(index)} className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-700 transition-all">x</button>
          </li>

        ))}
      </ul>
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
      <input type="number" value={modifier} onChange={e => setModifier(e.target.value)} placeholder="Modifier" />
      <button onClick={handleAddItem}>Add</button>
    </div>
  );
};

export default Store;
