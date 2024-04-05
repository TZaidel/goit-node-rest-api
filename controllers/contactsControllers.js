import {listContacts,
  getContactById,
  removeContact,
  addContact, updContact
} from "../services/contactsServices.js";
  
import {catchAsync} from '../helpers/catchAsync.js'
import HttpError from '../helpers/HttpError.js'

import {createContactSchema, updateContactSchema} from '../schemas/contactsSchemas.js'


export const getAllContacts = catchAsync(async (req, res, next) => {
  const data = await listContacts()
  res.status(200).json(data)
})

export const getOneContact = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const data = await getContactById(id)
  if (!data) throw HttpError(404, "Not found")
  res.status(200).json(data)
  
})

export const deleteContact = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const result = await removeContact(id)
  if (!result) throw HttpError(404, "Not found")
  res.status(200).json(result)
})

export const createContact = catchAsync(async (req, res, next) => {
  const newContact = await addContact(req.body)
  if (!newContact) throw HttpError(400, 'Failed to create contact')
  res.status(201).json(newContact)
})

export const updateContact = catchAsync(async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    throw HttpError(404, 'Body must have at least one field');
  }
  const { id } = req.params;
  const updatedContact = await updContact(id, req.body);
  if (!updatedContact) throw HttpError(404, 'Not found');
  res.json(updatedContact);
})
