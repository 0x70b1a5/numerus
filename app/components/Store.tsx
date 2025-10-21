'use client';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid'
import { FaCircle, FaRegCircle } from 'react-icons/fa6';

enum ModifierCategory {
  None,
  Attack,
  Damage,
  AC,
  Skill,
  AllSaves,
  FortitudeSave,
  ReflexSave,
  WillSave
}

interface Modifier {
  name: string
  description: string
  modifier: number
  categories: ModifierCategory[]
  checked: boolean
  guid: string
  modifiers?: { category: ModifierCategory; modifier: number }[]
}

interface CategoryModifier {
  category: ModifierCategory;
  modifier: number;
}

const Store = () => {
  let li: any = undefined
  if (process.browser) {
    li = localStorage.getItem('items')
    console.log({ items: li })
  }
  const [items, setItems] = useState<Modifier[]>(li ? JSON.parse(li) : []);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryModifiers, setCategoryModifiers] = useState<Record<ModifierCategory, string>>({
    [ModifierCategory.None]: '0',
    [ModifierCategory.Attack]: '0',
    [ModifierCategory.Damage]: '0',
    [ModifierCategory.AC]: '0',
    [ModifierCategory.Skill]: '0',
    [ModifierCategory.AllSaves]: '0',
    [ModifierCategory.FortitudeSave]: '0',
    [ModifierCategory.ReflexSave]: '0',
    [ModifierCategory.WillSave]: '0'
  });
  const [atktotal, setAtkTotal] = useState(0);
  const [dmgtotal, setDmgTotal] = useState(0);
  const [deftotal, setDefTotal] = useState(0);
  const [skilltotal, setSkillTotal] = useState(0);
  const [fortsavetotal, setFortSaveTotal] = useState(0);
  const [reflexsavetotal, setReflexSaveTotal] = useState(0);
  const [willsavetotal, setWillSaveTotal] = useState(0);
  const [allsavetotal, setAllSaveTotal] = useState(0);

  const handleCategoryModifierChange = (category: ModifierCategory, value: string) => {
    setCategoryModifiers(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleAddItem = () => {
    const activeModifiers: CategoryModifier[] = Object.entries(categoryModifiers)
      .filter(([_, value]) => value !== '0')
      .map(([category, value]) => ({
        category: Number(category) as ModifierCategory,
        modifier: parseInt(value)
      }));

    if (activeModifiers.length === 0 || !name) return;

    const newItem: Modifier = {
      name,
      description,
      guid: uuid(),
      checked: false,
      categories: activeModifiers.map(m => m.category),
      modifier: activeModifiers[0].modifier,
      modifiers: activeModifiers
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    localStorage.setItem('items', JSON.stringify(updatedItems));
    setName('');
    setDescription('');
    setCategoryModifiers(Object.fromEntries(
      Object.entries(categoryModifiers).map(([key]) => [key, '0'])
    ) as Record<ModifierCategory, string>);
  };

  useEffect(() => {
    updateTotals()
  }, [items])

  const updateTotals = () => {
    console.log(items)
    setAtkTotal(items.reduce((acc: number, item) => {
      if (!item.checked) return acc;
      const attackMod = item.modifiers?.find(m => m.category === ModifierCategory.Attack);
      return acc + (attackMod?.modifier || 0);
    }, 0));
    setDefTotal(items.reduce((acc: number, item) => {
      if (!item.checked) return acc;
      const acMod = item.modifiers?.find(m => m.category === ModifierCategory.AC);
      return acc + (acMod?.modifier || 0);
    }, 0));
    setDmgTotal(items.reduce((acc: number, item) => {
      if (!item.checked) return acc;
      const dmgMod = item.modifiers?.find(m => m.category === ModifierCategory.Damage);
      return acc + (dmgMod?.modifier || 0);
    }, 0));
    setSkillTotal(items.reduce((acc: number, item) => {
      if (!item.checked) return acc;
      const skillMod = item.modifiers?.find(m => m.category === ModifierCategory.Skill);
      return acc + (skillMod?.modifier || 0);
    }, 0));
    setFortSaveTotal(items.reduce((acc: number, item) => {
      if (!item.checked) return acc;
      const fortMod = item.modifiers?.find(m => m.category === ModifierCategory.FortitudeSave);
      const allSavesMod = item.modifiers?.find(m => m.category === ModifierCategory.AllSaves);
      return acc + (fortMod?.modifier || 0) + (allSavesMod?.modifier || 0);
    }, 0));
    setReflexSaveTotal(items.reduce((acc: number, item) => {
      if (!item.checked) return acc;
      const reflexMod = item.modifiers?.find(m => m.category === ModifierCategory.ReflexSave);
      const allSavesMod = item.modifiers?.find(m => m.category === ModifierCategory.AllSaves);
      return acc + (reflexMod?.modifier || 0) + (allSavesMod?.modifier || 0);
    }, 0));
    setWillSaveTotal(items.reduce((acc: number, item) => {
      if (!item.checked) return acc;
      const willMod = item.modifiers?.find(m => m.category === ModifierCategory.WillSave);
      const allSavesMod = item.modifiers?.find(m => m.category === ModifierCategory.AllSaves);
      return acc + (willMod?.modifier || 0) + (allSavesMod?.modifier || 0);
    }, 0));
    setAllSaveTotal(items.reduce((acc: number, item) => {
      if (!item.checked) return acc;
      const allSavesMod = item.modifiers?.find(m => m.category === ModifierCategory.AllSaves);
      return acc + (allSavesMod?.modifier || 0);
    }, 0));
  }

  const handleCheckItem = (guid: string) => {
    const updatedItems = items.map((item) => item.guid === guid ? { ...item, checked: !item.checked } : item);
    setItems(updatedItems);
    localStorage.setItem('items', JSON.stringify(updatedItems));
  };

  const handleRemoveItem = (index: number) => {
    if (!confirm('Are you sure you want to remove this item?')) return;
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
    localStorage.setItem('items', JSON.stringify(updatedItems));
  }

  const hr = <div className='p-px self-stretch my-2 bg-gray-600' />
  const anyBonuses = atktotal || dmgtotal || deftotal || skilltotal || fortsavetotal || reflexsavetotal || willsavetotal || allsavetotal


  const getCategoryColor = (cat: ModifierCategory) => {
    switch(cat) {
      case ModifierCategory.Attack: return '#dc2626';
      case ModifierCategory.Damage: return '#ea580c';
      case ModifierCategory.AC: return '#d97706';
      case ModifierCategory.Skill: return '#16a34a';
      case ModifierCategory.FortitudeSave: return '#0891b2';
      case ModifierCategory.ReflexSave: return '#4f46e5';
      case ModifierCategory.WillSave: return '#2563eb';
      case ModifierCategory.AllSaves: return '#7c3aed';
      default: return '#6b7280';
    }
  };


  return (
    <div className='flex flex-col place-items-center gap-2 store max-w-lg' style={{ fontFamily: '\'WDXL Lubrifont TC\', monospace' }}>
      <h1
        className='text-xl rounded-b-md bg-gradient-to-r from-red-500 via-blue-500 to-green-500 text-center text-gray-100 shadow-md self-stretch px-2 py-1 m-0 text-shadow-md text-4xl'
        style={{ textShadow: '1px 1px 0px black' }}
      >
        NUMERUS
      </h1>
      <div className='self-stretch grid grid-cols-3 md:grid-cols-4 items-stretch gap-1 text-white boni mx-2'>
        <h1
          className={classNames('bg-red-700', { 'opacity-25': !atktotal })}
        >
          ATK: {atktotal >= 0? '+' :''}{atktotal}
        </h1>
        <h1
          className={classNames('bg-orange-700', { 'opacity-25': !dmgtotal })}
        >
          DMG: {dmgtotal >= 0? '+' :''}{dmgtotal}
        </h1>
        <h1
          className={classNames('bg-amber-700', { 'opacity-25': !deftotal })}
        >
          AC: {deftotal >= 0? '+' :''}{deftotal}
        </h1>
        <h1
          className={classNames('bg-green-700', { 'opacity-25': !skilltotal })}
        >
          SKL: {skilltotal >= 0? '+' :''}{skilltotal}
        </h1>
        <h1
          className={classNames('bg-cyan-700', { 'opacity-25': !fortsavetotal })}
        >
          FOR: {fortsavetotal >= 0? '+' :''}{fortsavetotal}
        </h1>
        <h1
          className={classNames('bg-indigo-700', { 'opacity-25': !reflexsavetotal })}
        >
          REF: {reflexsavetotal >= 0? '+' :''}{reflexsavetotal}
        </h1>
        <h1
          className={classNames('bg-blue-700', { 'opacity-25': !willsavetotal })}
        >
          WIL: {willsavetotal >= 0? '+' :''}{willsavetotal}
        </h1>
        <h1
          className={classNames('bg-violet-700', { 'opacity-25': !allsavetotal })}
        >
          SAV: {allsavetotal >= 0? '+' :''}{allsavetotal}
        </h1>
      </div>
      {hr}
      {items?.length > 0 ? <>
        <div className='text-2xl font-bold'>MODIFIERS:</div>
        <ul className='gap-2 flex flex-col self-stretch'>
           {items.filter(Boolean).map((item, index) => {
             const categoryColors = item.categories?.map(getCategoryColor).filter(Boolean) || [];
             const totalCategories = categoryColors.length;

             return <li key={index}
             className={classNames('flex flex-col shadow-md self-stretch rounded overflow-hidden bg-white')}
           >
             <div className='flex flex-row items-center gap-2 px-2 py-1'>
               <button onClick={() => handleCheckItem(item.guid)} className='text-3xl aspect-square bg-white rounded-full border-none'>
                 {item.checked ? <FaCircle /> : <FaRegCircle />}
               </button>
               <div className='flex flex-col mr-auto bg-white rounded-md p-2 gap-1'>
                 <span className='font-bold text-xl leading-tight'>{item.name}</span>
                 {item.description && <span className='text-gray-600'>{item.description}</span>}
                 <div className="flex flex-wrap gap-1">
                 {item.modifiers?.map((mod, i) => (
                   <span key={i} style={{ backgroundColor: getCategoryColor(mod.category) + '40' }} className='rounded-full px-2'>
                     {mod.modifier >= 0 ? '+' : ''}{mod.modifier} {ModifierCategory[mod.category]}
                   </span>
                 ))}
                 </div>
               </div>
               <button onClick={() => handleRemoveItem(index)} className='text-red-500 text-3xl bg-transparent p-0'>X</button>
             </div>
             <div className='flex h-1' style={{ height: '0.25rem' }}>
               {categoryColors.map((color, i) => (
                 <div
                   key={i}
                   style={{
                     backgroundColor: color,
                     width: `${100 / totalCategories}%`
                   }}
                 />
               ))}
             </div>
           </li>
           })}
         </ul>
        {hr}
      </> : null}
      <div className='text-2xl font-bold'>ADD NEW:</div>
      <input className='!self-stretch' type='text' value={name} onChange={e => setName(e.target.value)} placeholder='Name' />
      <textarea className='!self-stretch' value={description} onChange={e => setDescription(e.target.value)} placeholder='Description' />
      <div className='grid grid-cols-2 md:grid-cols-3 gap-2 self-stretch mx-2 my-2'>
        {Object.entries(ModifierCategory)
          .filter(([key]) => isNaN(Number(key)) && key !== 'None')
          .map(([key, value]) => (
            <div key={key} className={classNames(
              'flex flex-col space-y-1 p-2 rounded',
              {
                'bg-red-100': value === ModifierCategory.Attack,
                'bg-purple-100': value === ModifierCategory.Damage,
                'bg-blue-100': value === ModifierCategory.AC,
                'bg-green-100': value === ModifierCategory.Skill,
                'bg-yellow-100': value === ModifierCategory.FortitudeSave,
                'bg-orange-100': value === ModifierCategory.ReflexSave,
                'bg-pink-100': value === ModifierCategory.WillSave,
                'bg-gray-100': value === ModifierCategory.AllSaves,
              }
            )}>
              <label className='font-bold'>{key}</label>
              <input
                type='number'
                value={categoryModifiers[value as ModifierCategory]}
                onChange={e => handleCategoryModifierChange(value as ModifierCategory, e.target.value)}
                className='px-2 rounded border border-gray-300'
                placeholder='0'
              />
            </div>
          ))}
      </div>
      <button
        onClick={handleAddItem}
        className='mx-2 self-stretch bg-green-500 disabled:bg-gray-300'
        disabled={!name || Object.values(categoryModifiers).every(v => v === '0')}
      >
        Add
      </button>
    </div>
  );
};

export default Store;
