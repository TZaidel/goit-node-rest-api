import {listContacts,
  getContactById,
  removeContact,
  addContact, updContact
} from "../services/contactsServices.js";
  
import HttpError from '../helpers/HttpError.js'

import {createContactSchema, updateContactSchema} from '../schemas/contactsSchemas.js'


export const getAllContacts =async (req, res, next) => {
  try {
    const data = await listContacts()
    return res.json(data)
  } catch (error) {
    next(error)
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const {id} = req.params
    const data = await getContactById(id)

    if (!data) {
      throw HttpError(404, "Not found")
    }
    return res.json(data)
  } catch (error) {
    next(error)
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await removeContact(id)
    if (!result) {
      throw HttpError(404, 'Not found')
    }
    res.json({
       message: "delete success"
     })
  } catch (error) {
    next(error)
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body)
    if (error) {
      throw HttpError(400, error.message)
    }

    const newContact = await addContact(req.body)
    res.status(201).json(newContact)
  }
  catch (error) {
    next(error)
  }
};

export const updateContact =async (req, res) => {
  try {
    const { error } = createContactSchema.validate(req.body)
    if (error) {
      throw HttpError(400, error.message)
    }
    const { id } = req.params
    
    const updatedContact = await updContact(id, req.body)
    if (!updatedContact) {
      throw HttpError(404, "Not found")
    }
    res.json(updatedContact)
  }
  catch (error) {
    console.log(error)
  }
};



// export const getOneContact = async (req, res, next) => {
//   try {
//     const {id} = req.params
//     const data = await getContactById(id)

//     if (!data) {
//       throw HttpError(404, "Not found")
      //or
      // const error = new Error("Not found")
      // error.status = 404
      // throw error
      //or
      // res.status(404).json({
      //   message: "not found"
      // })
  //   }
  //   return res.json(data)
  // } catch (error) {
  //   next(error)
    //or
    // const { status = 500, message = "server error" } = error
    // res.status(status).json({
    //   message
    // })
    //or
    // res.status(500).json({
    //   message: "server error"
    // })
//   }
// };