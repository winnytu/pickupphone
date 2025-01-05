import './styles.scss'

const NoteMemo = ({ noteData }) => {
  if (!noteData?.metadata || !noteData?.content?.text) {
    return null
  }

  const { metadata, content } = noteData

  // 處理 content.text 可能是字串或陣列的情況
  const getTextLines = () => {
    if (Array.isArray(content.text)) {
      return content.text
    }
    if (typeof content.text === 'string') {
      return content.text.split('\n')
    }
    return []
  }

  const textLines = getTextLines()

  return (
    <div className="memo-container screenshot-container">
      <div className="memo-header">
        <div className="status-bar">
          <div className="time">9:41</div>
          <div className="icons">
            <span className="signal">●●●●</span>
            <span className="wifi">◎</span>
            <span className="battery">100%</span>
          </div>
        </div>
        <div className="nav-bar">
          <div className="back">備忘錄</div>
          <div className="actions">
            <button className="share">分享</button>
            <button className="done">完成</button>
          </div>
        </div>
      </div>
      <div className="memo-content">
        <div className="title">{metadata.title}</div>
        <div className="timestamp">
          {new Date(metadata.created_at).toLocaleString('zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}
        </div>
        <div className="text-content">
          {textLines.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NoteMemo 