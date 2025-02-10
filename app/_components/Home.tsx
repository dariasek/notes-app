'use client'

import { useEffect, useState } from 'react';
import { createRxDatabase } from 'rxdb/plugins/core';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import NoteCreator from './NoteCreator';
import Note from './Note';

const POSTS_ENDPOINT = 'https://jsonplaceholder.typicode.com/posts'

const myDatabase = await createRxDatabase({
  name: 'mydatabase',
  storage: wrappedValidateAjvStorage({
    storage: getRxStorageDexie()
  })
});

await myDatabase.addCollections({
  // name of the collection
  notes: {
    // we use the JSON-schema standard
    schema: {
      version: 0,
      primaryKey: 'id',
      type: 'object',
      properties: {
        id: {
          type: 'string',
          maxLength: 100 // <- the primary key must have maxLength
        },
        userId: {
          type: 'string'
        },
        noteTitle: {
          type: 'string'
        },
        noteBody: {
          type: 'string'
        },
      },
      required: ['id', 'userId', 'noteTitle', 'noteBody']
    }
  }
});


export interface NoteInterface {
  id: string,
  userId: string,
  noteTitle: string,
  noteBody: string
}

export interface NoteUpdateFields {
  noteTitle: string,
  noteBody: string
}

export default function Home() {
  const [notes, setNotes] = useState<NoteInterface[]>([])

  useEffect(() => {
    const fetchFromAPI = () => fetch(POSTS_ENDPOINT)
      .then((resp) => resp.json())
      .then(resp => {
        const notes = resp.map((note: {id: string, userId: string, title: string, body: string}) => ({
          id: `${note.id}`,
          userId: `${note.userId}`,
          noteTitle: note.title,
          noteBody: note.body
        })) 
        setNotes(notes)
        myDatabase.notes.bulkInsert(notes)
      })

    myDatabase.notes.find().exec().then((resp) => {
      if (resp.length) {
        const notes = resp.map((note) => ({
          id: `${note.id}`,
          userId: `${note.userId}`,
          noteTitle: note.noteTitle,
          noteBody: note.noteBody
        })) 
        setNotes(notes)
      } else {
        fetchFromAPI()
      }
    })    
  }, [])


  const removeNote = async (noteId: string) => {
    const doc = await myDatabase.notes.findOne({
      selector: {
        id: {
          $eq: noteId
        }
      }
    }).exec()

    setNotes(notes.filter(note => note.id !== noteId))
    fetch(`${POSTS_ENDPOINT}/${noteId}`, {
      method: 'DELETE'
    })
    doc.remove()
  }

  const onNoteUpdate = async (noteId: string, body: NoteUpdateFields) => {
    const doc = await myDatabase.notes.findOne({
      selector: {
        id: {
          $eq: noteId
        }
      }
    }).exec()

    setNotes(
      notes.map(
        note => {
          if (note.id === noteId) {
            return {
              ...note,
              noteBody: body.noteBody,
              noteTitle: body.noteTitle
            }
          }

          return note
        }
      )
    )
    doc.patch({
      noteBody: body.noteBody,
      noteTitle: body.noteTitle
    })
    fetch(`${POSTS_ENDPOINT}/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify({
        id: noteId,
        userId: doc.userId,
        title: body.noteTitle,
        body: body.noteBody,
      })
    })
  }

  const addNote = async (note: NoteInterface) => {
    setNotes([note, ...notes])
    myDatabase.notes.insert({
      id: `${note.id}`,
      userId: `${note.userId}`,
      noteTitle: note.noteTitle,
      noteBody: note.noteBody
    })
    fetch(POSTS_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({
        id: note.id,
        userId: note.userId,
        title: note.noteTitle,
        body: note.noteBody,
      })
    })
  }
  const children = notes.map(note => (<Note
    key={note.id}
    onNoteUpdate={onNoteUpdate}
    removeNote={removeNote}
    note={note}
  />))  

  return (
    <div className="flex justify-center">
      <main className='w-[512px] pt-4'>
        <h1 className='text-xl text-center font-extrabold'>Notes App</h1>
        <NoteCreator addNote={addNote} />
        <div>
          {children}
        </div>
      </main>
    </div>
  );
}