'use client';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid'
enum ModifierCategory {
  None,
  Attack,
  Damage,
  AC,
  Skill,
}

interface Modifier {
  name: string
  description: string
  modifier: number
  category: ModifierCategory
  checked: boolean
  guid: string
}

const Store = () => {
  let li: any = undefined
  if (process.browser) {
    li = localStorage.getItem('items')
  }
  const [items, setItems] = useState<Modifier[]>(li ? JSON.parse(li) : []);
  const [name, setName] = useState('');
  const [category, setCategory] = useState(ModifierCategory.Attack);
  const [description, setDescription] = useState('');
  const [modifier, setModifier] = useState('0');
  const [atktotal, setAtkTotal] = useState(items.reduce((acc: number, item: Modifier) => acc + (item.checked && item.category === ModifierCategory.Attack  ? item.modifier : 0), 0));
  const [dmgtotal, setDmgTotal] = useState(items.reduce((acc: number, item: Modifier) => acc + (item.checked && item.category === ModifierCategory.Damage ? item.modifier : 0), 0));
  const [deftotal, setDefTotal] = useState(items.reduce((acc: number, item: Modifier) => acc + (item.checked && item.category === ModifierCategory.AC ? item.modifier : 0), 0));
  const [skilltotal, setSkillTotal] = useState(items.reduce((acc: number, item: Modifier) => acc + (item.checked && item.category === ModifierCategory.Skill ? item.modifier : 0), 0));

  const handleCategoryChange = (c: ModifierCategory) => {
    console.log(c)
    setCategory(c)
  }

  const handleAddItem = () => {
    const newItem = { name, description, guid: uuid(), modifier: parseInt(modifier), checked: false, category };
    console.log(newItem)
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    localStorage.setItem('items', JSON.stringify(updatedItems));
    setName('');
    setDescription('');
    setCategory(ModifierCategory.Attack)
    setModifier('0');
  };

  useEffect(() => {
    updateTotals()
  }, [items])

  const updateTotals = () => {
    console.log(items)
    setAtkTotal(items.reduce((acc: number, { checked, category, modifier }: Modifier) => acc + ((checked && category === ModifierCategory.Attack) ? modifier : 0), 0));
    setDefTotal(items.reduce((acc: number, { checked, category, modifier }: Modifier) => acc + ((checked && category === ModifierCategory.AC) ? modifier : 0), 0));
    setDmgTotal(items.reduce((acc: number, { checked, category, modifier }: Modifier) => acc + ((checked && category === ModifierCategory.Damage) ? modifier : 0), 0));
    setSkillTotal(items.reduce((acc: number, { checked, category, modifier }: Modifier) => acc + ((checked && category === ModifierCategory.Skill) ? modifier : 0), 0));
  }

  const handleCheckItem = (guid: string) => {
    const updatedItems = items.map((item) => item.guid === guid ? { ...item, checked: !item.checked } : item);
    setItems(updatedItems);
    localStorage.setItem('items', JSON.stringify(updatedItems));
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
    localStorage.setItem('items', JSON.stringify(updatedItems));
  }

  const hr = <div className='p-0.5 self-stretch my-2 bg-gray-900' />

  return (
    <div className='flex flex-col place-items-center store' style={{ fontFamily: '\'Press Start 2P\', monospace' }}>
      <h1 className='text-xl bg-gradient-to-r from-red-500 via-blue-500 to-green-500 text-center text-gray-100 shadow-md self-stretch px-2 py-1 m-0' style={{ textShadow: '1px 1px 0px black' }}>NUMERUS</h1>
      <div className='flex'>
        <h1 className='text-center rounded px-2 py-1 shadow-md bg-red-700 text-gray-100 mx-1'>ATK: {atktotal >= 0? '+' :''}{atktotal}</h1>
        <h1 className='text-center rounded px-2 py-1 shadow-md bg-purple-700 text-gray-100 mx-1'>DMG: {dmgtotal >= 0? '+' :''}{dmgtotal}</h1>
        <h1 className='text-center rounded px-2 py-1 shadow-md bg-blue-700 text-gray-100 mx-1'>AC: {deftotal >= 0? '+' :''}{deftotal}</h1>
        <h1 className='text-center rounded px-2 py-1 shadow-md bg-green-700 text-gray-100 mx-1'>SKL: {skilltotal >= 0? '+' :''}{skilltotal}</h1>
      </div>
      {hr}
      <h1>MODIFIERS:</h1>
	    <ul className='mx-2 my-1 self-stretch'>
        {items.map((item, index) => <li key={index} 
          className={classNames('flex flex-row shadow-md text-xs self-stretch items-center justify-between rounded px-2 py-1 mx-2 my-1', 
            { 
              'bg-red-200': item.category === ModifierCategory.Attack, 
              'bg-purple-200': item.category === ModifierCategory.Damage, 
              'bg-blue-200': item.category === ModifierCategory.AC, 
              'bg-green-200': item.category === ModifierCategory.Skill })}
        >
          <input className='mr-8' type='checkbox' checked={item.checked} style={{ transform: 'scale(2.5)' }} onChange={() => handleCheckItem(item.guid)} />
          <div className='flex flex-col grow'>
            <span>
              {item.name}:
            </span>
            {item.description && <span>
              : {item.description}
            </span>}
            <span>
              {item.modifier > -1 ? '+':''}{item.modifier} {ModifierCategory[item.category]}
            </span>
          </div>
          <button onClick={() => handleRemoveItem(index)} className='ml-2 px-2 py-1 bg-red-500 text-white text-xl rounded-md hover:bg-red-700 transition-all'>X</button>
        </li>)}
      </ul>
      {hr}
      <h1>ADD NEW:</h1>
      <input className='self-stretch' type='text' value={name} onChange={e => setName(e.target.value)} placeholder='Name' />
      <textarea className='self-stretch' value={description} onChange={e => setDescription(e.target.value)} placeholder='Description' />
      <div className='flex'>
        <input className='w-1/2' type='number' value={modifier} onChange={e => setModifier(e.target.value)} placeholder='Modifier' />
        <select className='px-2 py-1 w-1/2 mx-2 my-1 rounded' value={category} onChange={(e) => handleCategoryChange(+e.currentTarget.value)}>
          <option value={ModifierCategory.Attack}>Attack</option>
          <option value={ModifierCategory.Damage}>Damage</option>
          <option value={ModifierCategory.AC}>AC</option>
          <option value={ModifierCategory.Skill}>Skill</option>
        </select>
      </div>
      <button onClick={handleAddItem} className='mx-2 self-stretch bg-green-500' disabled={!name || !modifier || modifier === '0'}>Add</button>
    </div>
  );
};

export default Store;
