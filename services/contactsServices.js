import {Contact} from '../models/contactModel.js'

async function listContacts() {
  const contacts = await Contact.find()
  return contacts 
}

async function getContactById(contactId) {
  const contatcs = await listContacts()
  const result = Contact.findById(contactId)
  return result || null
}

async function removeContact(contactId) {
  const removedContact = await Contact.findByIdAndDelete(contactId)
  return removedContact
}

async function updContact(contactId, data) {
  const result = await Contact.findByIdAndUpdate(contactId, data, { new: true })
  return result
}

async function updStatusContact(contactId, data) {
  const { favorite } = data
  const result = await Contact.findByIdAndUpdate(contactId, {favorite}, { new: true })
  return result
}


async function addContact(data) {
  const newContact = await Contact.create(data)
  return newContact
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updContact,
  updStatusContact
}