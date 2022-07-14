interface ContentEditorProps {
  content: string,
  onChange: (newContent: string) => void,
}

export default function ContentEditor(props: ContentEditorProps) {
  return (
    <textarea 
      rows={40}
      value={props.content}
      onChange={e => props.onChange(e.target.value)} />
  );
}