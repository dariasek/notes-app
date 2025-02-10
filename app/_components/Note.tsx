import React, { useState } from 'react'
import { Check, DeleteIcon, Edit } from 'lucide-react'
import { NoteInterface, NoteUpdateFields } from './Home'

const Note = ({
    note,
    removeNote,
    onNoteUpdate,
}: {
    note: NoteInterface,
    removeNote: (noteId: string) => void,
    onNoteUpdate: (noteId: string, noteBody: NoteUpdateFields) => Promise<void>,
}) => {
    const [editModeOn, setEditModeOn] = useState(false)
    const [title, setTitle] = useState(note.noteTitle)
    const [body, setBody] = useState(note.noteBody)

    const onEdit = async () => {
        setEditModeOn(false)

        if (body !== note.noteBody || title !== note.noteTitle) {
            onNoteUpdate(note.id, {
                noteTitle: title,
                noteBody: body
            })
        }
    }

    const onEnter = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            onEdit()
        }
    }

    return (
        <div className='my-4 p-4 border rounded w-[100%]'>
            <div className='note p-4 rounded w-[100%]'>
            <div className='flex justify-between  pb-1 mb-2 border-b'>
                {
                    editModeOn
                        ? (
                            <div>
                                <textarea
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    onKeyDown={onEnter}
                                />
                            </div>
                        )
                        : (
                            <h2 className='font-bold max-w-80'>
                                {title}
                            </h2>
                        )
                }

                <div className='flex space-x-4'>
                    <div className='content-center'>
                        {
                            editModeOn
                                ? (<Check
                                    className='w-6 h-6 text-gray-400 cursor-pointer hover:text-green-400'
                                    onClick={onEdit}
                                />)
                                : (<Edit
                                    className='w-6 h-6 text-gray-400 cursor-pointer hover:text-blue-400'
                                    onClick={() => setEditModeOn(true)}
                                />)
                        }
                    </div>
                    <div className='content-center' onClick={() => removeNote(note.id)} >
                        <DeleteIcon className='w-6 h-6 text-gray-400 cursor-pointer hover:text-red-400' />
                    </div>
                </div>

            </div>
            {
                editModeOn
                    ? (
                        <div className='note'>
                            <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                onKeyDown={onEnter}
                                className='w-[100%]'
                            />
                        </div>
                    )
                    : (
                        <div >
                            {body}
                        </div>
                    )
            }
            </div>
            
        </div>
    )
}

export default Note