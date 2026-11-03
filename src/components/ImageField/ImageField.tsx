import { useRef, useState, type DragEvent } from 'react'
import { useSheetField } from '@/components/SheetProvider'
import { isImageData } from './utils/isImageData'
import { shrinkImage } from './utils/shrinkImage'
import './ImageField.styles.css'

type ImageFieldProps = {
  /** Path to the image, stored as a data URL. */
  path: string
  label: string
}

export function ImageField({ path, label }: ImageFieldProps) {
  const [stored, setImage] = useSheetField<string | undefined>(path)
  const image = isImageData(stored) ? stored : undefined
  const [error, setError] = useState<string>()
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = async (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('That file is not an image.')
      return
    }
    try {
      setImage(await shrinkImage(file))
      setError(undefined)
    } catch {
      setError('Could not read that image.')
    }
  }

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    setDragging(false)
    void load(event.dataTransfer.files[0])
  }

  return (
    <div className="image-field-container">
      <button
        type="button"
        className={dragging ? 'image-field-drop image-field-dragging' : 'image-field-drop'}
        aria-label={image ? `Change ${label.toLowerCase()}` : `Add ${label.toLowerCase()}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {image ? (
          <img src={image} alt={label} />
        ) : (
          <span className="image-field-hint">Click or drop an image here</span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          void load(event.target.files?.[0])
          event.target.value = ''
        }}
      />
      {error && <p className="image-field-error">{error}</p>}
      {stored && !image && <p className="image-field-error">The saved image isn&apos;t a supported picture, so it isn&apos;t shown.</p>}
      {stored && (
        <button type="button" className="image-field-remove" onClick={() => setImage('')}>
          Remove image
        </button>
      )}
    </div>
  )
}
