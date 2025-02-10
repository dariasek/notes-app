import { PlusCircle } from 'lucide-react'
import React, { useState } from 'react'
import { NoteInterface } from './Home'

const NoteCreator = ({
    addNote
}: {
    addNote: (note: NoteInterface) => Promise<void>
}) => {
    const [noteTitle, setNoteTitle] = useState('')
    const [noteBody, setNoteBody] = useState('')

    const onAddNote = () => {
        if (noteTitle === '' || noteBody === '') {
            throw new Error('Fill all fields')
        }
        addNote({
            noteBody,
            noteTitle,
            userId: '1',
            id: `${Math.floor(Math.random() * 1000)}`
        })
        setNoteTitle('')
        setNoteBody('')
    }

  return (
    <div>
        <button
            className='flex border py-2 px-4 items-center rounded-xl'
            onClick={onAddNote}
        >
            <p>Add new note </p>
            <PlusCircle className='w-6 h-6 pl-2' />
        </button>
        <div className='my-4 w-[100%]'>
            <input
                type='text'
                placeholder='My first note'
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className='px-4 py-2 border rounded-lg w-[100%]'
            />
        </div>
        <div>
            <textarea
                name='new note body'
                placeholder='My note is...'
                value={noteBody}
                onChange={(e) => setNoteBody(e.target.value)}
                className='px-4 py-2 border rounded-lg w-[100%]'
            />
        </div>
    </div>
  )
}

export default NoteCreator