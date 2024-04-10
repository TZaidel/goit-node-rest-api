import {listContacts,
  getContactById,
  removeContact,
  addContact,
  updContact,
  updStatusContact
} from "../services/contactsServices.js";
  
import {catchAsync} from '../helpers/catchAsync.js'
import HttpError from '../helpers/HttpError.js'

export const getAllContacts = catchAsync(async (req, res) => {
  const data = await listContacts()
  res.status(200).json(data)
})

export const getOneContact = catchAsync(async (req, res) => {
  const { id } = req.params
  const data = await getContactById(id)
  if (!data) throw HttpError(404, "Not found")
  res.status(200).json(data)
})

export const deleteContact = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await removeContact(id)
  if (!result) throw HttpError(404, "Not found")
  res.status(200).json(result)
})

export const createContact = catchAsync(async (req, res) => {
  const newContact = await addContact(req.body)
  if (!newContact) throw HttpError(400, 'Failed to create contact')
  res.status(201).json(newContact)
})

export const updateContact = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await updContact(id, req.body)
  if (!result)  throw HttpError(404, "Not found")
  res.json(result)
})

export const updateStatus = catchAsync(async (req, res) => {
  const { id } = req.params
  const { favorite } = req.body
  const updatedContact = await updStatusContact(id, { favorite })
  if (!updatedContact) throw HttpError(404, "Not found")
  res.status(200).json(updatedContact)
})