import {Contact} from '../models/contactModel.js'

async function listContacts(id) {
  const contacts = await Contact.find({owner: id})
  return contacts 
}

async function getContactById(contactId, req) {
  const {_id: owner} = req.user
  const contatcs = await listContacts()
  const result = Contact.findOne({_id: contactId, owner})
  return result || null
}

async function removeContact(contactId, req) {
  const {_id: owner} = req.user
  const removedContact = await Contact.findOneAndDelete({_id: contactId, owner})
  return removedContact
}

async function updContact(req, contactId, data) {
  const {_id: owner} = req.user
  const result = await Contact.findOneAndUpdate({_id: contactId, owner}, data, { new: true })
  return result
}

async function updStatusContact(req, contactId, data) {
  const {_id: owner} = req.user
  const { favorite } = data
  const result = await Contact.findOneAndUpdate({_id: contactId, owner}, {favorite}, { new: true })
  return result
}


async function addContact(...args) {
  const newContact = new Contact(...args)
  await newContact.save()
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