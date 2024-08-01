"use client"
import Image from "next/image";
import {useState, useEffect} from 'react'
import {firestore} from '@/firebase'
import {Box, Typography, Modal, Stack, TextField, Button} from '@mui/material'
import { collection, getDocs, deleteDoc, doc, query, getDoc,setDoc } from 'firebase/firestore'

export default function Home() {

  const [inventory,setInventory] = useState([])
  const [open, setOpen] = useState(true)
  const [itemName, setItemName] = useState('')
  const[ searchQuery, setSearchQuery] = useState('')
  const [ displayList, setDisplayList] = useState([])

  const removeItem = async(item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDocs(docRef)
    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if(quantity ===1){
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef, {quantity : quantity - 1 })
      }
    }
  }
  // create a search component
  // we need to watch for it's change in state, and rerender every time, use onChange
  //


  const addItem = async(item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity : quantity + 1 })

    }
      else {
        await setDoc(docRef, {quantity : 1 })
      }

      await updateInventory()
      console.log('updating inventory')
    }
  


  const updateInventory = async() =>{
    const snapshot = query(collection(firestore, 'inventory'))
     const docs = await  getDocs(snapshot) 
     const inventoryList =[]
     docs.forEach((doc)=>{
    
      inventoryList.push({
        name : doc.id,
        ...doc.data(),
      })

     })
     setInventory(inventoryList)
     setDisplayList(inventoryList)
  }


  useEffect(()=>{
    updateInventory()
  },[])

  // useEffect(()=>{

  //   console.log(searchQuery)

  //   const inventoryItems = [...inventory]
  //   setDisplayList(
  //     inventory.filter(item=>
  //       item.name.toLowerCase().includes(query.toLowerCase())
  //     )
  //   )

  // },[searchQuery])

  const handleOpen = () => setOpen(true)
  const handleClose = ()=> setOpen(false)


  const handleSearchChange = (event)=>{

    const query = event.target.value
    console.log('set search query')
    setSearchQuery(query)

    //we want to keep the old list of inventories
    setDisplayList(
      inventory.filter(item=>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
    )

    //get the list of items that we have
    //filter the list of items
    //now, we must set the inventory
    //

  }


  return (
    <Box width = "100vw" 
      height = "100vh"
      display = "flex"
        justifyContent = "center"
        flexDirection="column"
        alignItems = "center"
      gap = {2}>
      <Modal open= {open} onClose = {handleClose} >
        <Box
          position = "absolute" 
          top = "50%"
          left = "50%"
          sx={{transform : "transalte(-50%, -50%)"}}
          width = {400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          >
            <Typography variant="">Add Item</Typography>
            <Stack width = "100%" direction = "row" spacing={2}>
            <TextField
            variant='outlined'
            fullWidth
            value={itemName}
            onChange={(e)=>{
              setItemName(e.target.value)
            }} />
            <Button variant= "outlined" onClick={()=>{
              addItem(itemName)
              setItemName('')
              handleClose()
            }}>
              Add
            </Button>
            </Stack>
          </Box>
      </Modal>
      <Button variant ="contained" onClick={()=>{
        handleOpen()
      }} >
        Add New Item
      </Button>
      <Box border = "1px solid #333">
        <Box
          width="800px" 
          height ="100px"
          display = "flex" 
          bgcolor="#ADD8E6" 
          alignItems="center" 
          justifyContent="center"
          >
            <Typography variant="h2" color ='#333'>
              Inventory Items
            </Typography>
          </Box>

      <Box
      py={2}
      display="flex"
      justifyContent="center"
      >
     <TextField 
        label = "Search"
        id="outlined-basic"
         variant="outlined"
         onChange={handleSearchChange}
         value={searchQuery}
         px={4}
         py={4}
          />

      </Box>

      
      <Stack width= "800px" height = "300px" spacing={2} overflow="auto">
        {
          displayList.map(({name, quantity}) =>(
            <Box key={name} width = "100%"
            minHeight = "150px"
            display = "flex"
            alignItems="center"
            justifyContent="space-between"
            bgcolor = "#f0f0f0"
            padding={5}>
              <Typography variant = "h3" color ="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant = "h3" color ="#333" textAlign="center">
                {quantity}
              </Typography>
              <Stack direction = "row" spacing = {2}>
              <Button variant = "contained" onClick={()=>{addItem(name)}}>
              Add

              </Button>
              <Button variant = "contained" onClick={()=>{removeItem()}}>
              Remove

              </Button>
              
              </Stack>
              

            </Box>

          ))
        }
      </Stack>
      </Box>
     
    </Box>
    

  );
}
