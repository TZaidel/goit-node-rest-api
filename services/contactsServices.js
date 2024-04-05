import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid'
import {Contact} from '../models/contactModel.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contactsPath = path.join(__dirname, '../db/contacts.json')


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
  const contacts = await listContacts()
  const index = contacts.findIndex(item => item.id === contactId)
  if (index === -1) {
    return null
  }
  const [result] = contacts.splice(index, 1)
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return result
}

async function updContact(contactId, data) {
  const contacts = await listContacts()
  const index = contacts.findIndex(item => item.id === contactId)
  if (index === -1) {
    return null
  }
  contacts[index] = {
    id: contactId,
    ...data
  }
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return contacts[index]
}



async function addContact(data) {
  const newContact = new Contact(data)
  await newContact.save()
  return newContact
}


export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updContact
}