import './styles.scss'
import DefaultAvatar from '../../images/default-avatar'

const KakaoChat = ({ chatData }) => {
  const { metadata, content } = chatData
  const participants = metadata.participants.reduce((acc, p) => {
    acc[p.id] = p
    return acc
  }, {})

  // 格式化時間戳
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  return (
    <div className="chat-container screenshot-container">
      <div className="chat-header">
        <div className="back-button">←</div>
        <div className="chat-title">
          {metadata.title}
          {metadata.chat_type === 'group' && <span className="member-count">3</span>}
        </div>
        <div className="menu-button">⋮</div>
      </div>
      <div className="chat-messages">
        {content.map((message) => {
          const sender = participants[message.sender_id]
          return (
            <div 
              className={`message-container ${sender.is_me ? 'is-me' : ''}`} 
              key={message.id}
            >
              {!sender.is_me && (
                <div className="avatar">
                  <DefaultAvatar />
                </div>
              )}
              <div className="message-content">
                {(!sender.is_me && metadata.chat_type === 'group') && (
                  <div className="sender-name">{sender.name}</div>
                )}
                <div className={`message-bubble ${sender.is_me ? 'is-me' : ''}`}>
                  {message.text}
                </div>
                <small className="timestamp">{formatTimestamp(message.timestamp)}</small>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default KakaoChat