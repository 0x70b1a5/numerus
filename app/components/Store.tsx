"use client";
import React, { useState } from 'react';

const Store = () => {
  const [items, setItems] = useState(JSON.parse(localStorage.getItem('items')) || []);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Attack');
  const [description, setDescription] = useState('');
  const [modifier, setModifier] = useState(0);
  const [atktotal, setAtkTotal] = useState(items.reduce((acc, item) => acc + (item.checked && item.category === 'Attack' ? item.modifier : 0), 0));
  const [deftotal, setDefTotal] = useState(items.reduce((acc, item) => acc + (item.checked && item.category === 'Defense' ? item.modifier : 0), 0));
  const [skilltotal, setSkillTotal] = useState(items.reduce((acc, item) => acc + (item.checked && item.category === 'Skill' ? item.modifier : 0), 0));
  const ads = ['Attack', 'Defense', 'Skills']
  const handleAddItem = () => {
    const newItem = { name, description, modifier: parseInt(modifier), checked: false, category };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    localStorage.setItem('items', JSON.stringify(updatedItems));
    setName('');
    setDescription('');
    setCategory('Attack')
    setModifier(0);
  };

const updateTotals = () => {
	setAtkTotal(updatedItems.reduce((acc, item) => acc + (item.checked && item.category === 'Attack' ? item.modifier : 0), 0));
  };
setDefTotal(updatedItems.reduce((acc, item) => acc + (item.checked && item.category === 'Defense' ? item.modifier : 0), 0));
  };
setSkillTotal(updatedItems.reduce((acc, item) => acc + (item.checked && item.category === 'Skill' ? item.modifier : 0), 0));
}

  const handleCheckItem = (index) => {
    const updatedItems = [...items];
    updatedItems[index].checked = !updatedItems[index].checked;
    setItems(updatedItems);
    localStorage.setItem('items', JSON.stringify(updatedItems));
    updateTotals()
  };

const handleRemoveItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
    localStorage.setItem('items', JSON.stringify(updatedItems));

  updateTotals()
}

  return (
    <div className='flex flex-col place-items-center store' style={{ fontFamily: '"Press Start 2P", monospace' }}>
      <h1 className="text-xl font-bold m-5">NUMERUS</h1>
      <h1 className="text-xl font-bold m-5">Attack: {atktotal >= 0? '+' :'-'}{atktotal}</h1>
<h1 className="text-xl font-bold m-5"> Defense: {deftotal >= 0? '+' :'-'}{deftotal}</h1>
<h1 className="text-xl font-bold m-5">Skill: {skilltotal >= 0? '+' :'-'}{skilltotal}</h1>
	    {categories.map(c => <ul key={c}>
    <li className='category'>{c}</li>
        {items.filter(i => i.category === c).map((item, index) => <li key={index} className="flex flex-row self-stretch items-center justify-between rounded border border-gray-500 px-2 py-1 mx-2 my-1">
            <input className="cb scale-150 p-4 mr-4" type="checkbox" checked={item.checked} onChange={() => handleCheckItem(index)} />
		<span>
            {item.name} {item.description && '-'} {item.description} - {item.modifier} ({item.category})
		</span>
<button onClick={() => handleRemoveItem(index)} className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-700 transition-all">x</button>
          </li>))}
      </ul>)}
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
      <input type="number" value={modifier} onChange={e => setModifier(e.target.value)} placeholder="Modifier" />
      <select value={category} onChange={(e) => setCategory(e.currentTarget.value)}
	<option value='Attack'>Attack</option>
	<option value='Defense'>Defense</option>
	<option value='Skill'>Skill</option>
      </select>
      <button onClick={handleAddItem}>Add</button>
    </div>
  );
};

export default Store;
