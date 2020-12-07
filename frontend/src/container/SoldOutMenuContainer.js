import React from 'react'
import {useAsync} from 'react-async'
import  styled ,{css}from 'styled-components'
import MenuAPI from '../api/saveData'
const Wrapper = styled.section`
  width:45%;
  height:100%;
  border:1px solid black;
   
`
const Text = styled.div`
  color: #495057;
  cursor: pointer;
  ${props =>
    props.SoldOut &&
    css`
      color: red;
    `}
`
async function getMenu(){
  const response = await MenuAPI.getAll()
  return response.data
}

export default function SoldOutMenuContainer() {
  const {data, error, isLoading,reload} = useAsync({
    promiseFn:getMenu
  })

  async function handleMainClick(menuPk){
     let response = await MenuAPI.setSoldout({pk:menuPk,type:"main_soldout"})
     reload()
     return response
   }
   async function handleOptionClick(optionPk){
     let response = await MenuAPI.setSoldout({pk:optionPk,type:"option_soldout"})
     reload()
     return response
   }
  
  if(isLoading) return <div>loading</div>
  if(error){
    data = {main:[],option:[],category:[]}
  }
  return (
    <Wrapper>
        <h2>메뉴 품절 관리 </h2>
        {data.category.map((category)=> 
          <div>
            <h2>{category.categoryName}</h2>
            
              {data.main.filter((main)=>main.categoryPk == category.categoryPk).map(
              (main,index)=><Text key={index} SoldOut = {main.menuSoldout} onClick={()=>handleMainClick(main.menuPk)}> {main.menuName}</Text>
            )}
            
          </div>
        )}
        <h2>옵션 품절 관리</h2>
        {data.option.map((option,index)=><Text key={index} onClick ={()=>handleOptionClick(option.optionPk)}SoldOut = {option.optionSoldout} > {option.optionName}</Text>)}
    </Wrapper>
  )
}
