import { useState } from 'react'
import html2canvas from 'html2canvas'
import { saveAs } from 'file-saver'
import KakaoChat from '../KakaoChat'
import NoteMemo from '../NoteMemo'
import documentation from '../../data/standardized_json_documentation.txt?raw'
import exampleJson from '../../data/example.json'
import CharacterForm from '../CharacterForm'
import ChatEditor from '../ChatEditor'
import './styles.scss'

const ChatGenerator = () => {
  const [activeTab, setActiveTab] = useState('generator') // 'generator' | 'docs' | 'editor'
  const [data, setData] = useState(null)
  const [jsonText, setJsonText] = useState('')
  const [error, setError] = useState('')

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result)
          setData(json)
          setError('')
        } catch (error) {
          setError('JSON 格式錯誤，請檢查檔案內容')
        }
      }
      reader.readAsText(file)
    }
  }

  const handleJsonInput = (e) => {
    setJsonText(e.target.value)
    if (!e.target.value) {
      setError('')
    }
  }

  const handleJsonSubmit = () => {
    try {
      const json = JSON.parse(jsonText)
      setData(json)
      setError('')
    } catch (error) {
      setError('JSON 格式錯誤，請檢查輸入內容')
    }
  }

  const downloadScreenshot = async (element, title, type) => {
    const rect = element.getBoundingClientRect()
    
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 3,
      width: rect.width,
      height: rect.height,
      logging: false,
      useCORS: true,
      windowWidth: rect.width,
      windowHeight: rect.height,
      x: 0,
      y: 0
    })
    canvas.toBlob((blob) => {
      saveAs(blob, `${type}-${title}-${new Date().getTime()}.png`)
    }, 'image/png', 1.0)
  }

  const downloadAll = async () => {
    const elements = document.querySelectorAll('.screenshot-container')
    const items = Array.from(elements)
    
    for (let i = 0; i < items.length; i++) {
      const item = data.items[i]
      await downloadScreenshot(items[i], item.title, item.type)
    }
  }

  const downloadMerged = async () => {
    const container = document.querySelector('.items-container')
    const canvas = await html2canvas(container, {
      backgroundColor: '#f5f5f5',
      scale: 2,
    })
    canvas.toBlob((blob) => {
      saveAs(blob, `all-items-${new Date().getTime()}.png`)
    })
  }

  const downloadDocumentation = () => {
    const blob = new Blob([documentation], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, 'standardized_json_documentation.txt')
  }

  const downloadExample = () => {
    const blob = new Blob([JSON.stringify(exampleJson, null, 2)], { type: 'application/json;charset=utf-8' })
    saveAs(blob, 'example.json')
  }

  const renderItem = (item) => {
    switch (item.type) {
      case 'chat':
        return <KakaoChat chatData={item} />
      case 'memo':
        return <NoteMemo noteData={item} />
      default:
        return null
    }
  }

  const handleGenerateTemplate = (settings) => {
    const template = {
      version: "1.0",
      metadata: {
        created_at: new Date().toISOString(),
        app_version: "1.0.0"
      },
      items: [
        {
          id: "chat1",
          type: "chat",
          metadata: {
            chat_type: "group",
            title: "男團工作群",
            participants: [
              { id: "user1", name: settings.mainCharacter.name },
              ...settings.supportingCharacters.map((char, index) => ({
                id: `user${index + 2}`,
                name: char.name
              })),
              { 
                id: "user" + (settings.supportingCharacters.length + 2), 
                name: settings.secondCharacter.name, 
                is_me: true 
              }
            ]
          },
          content: [
            // ... 根據設定生成對話內容
          ]
        }
      ]
    }

    setData(template)
  }

  return (
    <div className="generator-container">
      <h1>iOS 截圖生成器</h1>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'generator' ? 'active' : ''}`}
          onClick={() => setActiveTab('generator')}
        >
          上傳生成
        </button>
        <button 
          className={`tab ${activeTab === 'editor' ? 'active' : ''}`}
          onClick={() => setActiveTab('editor')}
        >
          在線編輯
        </button>
        <button 
          className={`tab ${activeTab === 'docs' ? 'active' : ''}`}
          onClick={() => setActiveTab('docs')}
        >
          創作說明
        </button>
      </div>

      {activeTab === 'docs' ? (
        <div className="documentation-section">
          <div className="doc-buttons">
            <button onClick={downloadDocumentation} className="doc-button">
              <span className="icon">📝</span>
              下載格式說明文檔
            </button>
            <button onClick={downloadExample} className="doc-button">
              <span className="icon">📋</span>
              下載範例 JSON
            </button>
          </div>
          <CharacterForm onGenerate={handleGenerateTemplate} />
        </div>
      ) : activeTab === 'editor' ? (
        <ChatEditor onGenerate={setData} />
      ) : (
        <>
          <div className="upload-section">
            <div className="file-upload">
              <input 
                type="file" 
                accept=".json"
                onChange={handleFileUpload}
                className="file-input"
                id="file-input"
              />
              <label htmlFor="file-input" className="file-label">
                選擇 JSON 檔案
              </label>
            </div>

            <div className="text-input">
              <h3>或直接貼上 JSON</h3>
              <textarea
                value={jsonText}
                onChange={handleJsonInput}
                placeholder="在此貼上 JSON 內容..."
                className="json-textarea"
              />
              <button 
                onClick={handleJsonSubmit}
                className="submit-json"
                disabled={!jsonText}
              >
                生成截圖
              </button>
              {error && <div className="error-message">{error}</div>}
            </div>
          </div>

          {data?.items?.length > 0 && (
            <div className="download-options">
              <button onClick={downloadAll} className="download-button">
                分別下載截圖
              </button>
              <button onClick={downloadMerged} className="download-button">
                下載合併截圖
              </button>
            </div>
          )}
          <div className="items-container">
            {data?.items?.map((item, index) => (
              <div key={index} className="item-wrapper">
                <div className="item-title">
                  {item.title}
                  <button 
                    onClick={(e) => {
                      const element = e.target.closest('.item-wrapper').querySelector('.screenshot-container')
                      downloadScreenshot(element, item.title, item.type)
                    }}
                    className="download-single"
                  >
                    下載
                  </button>
                </div>
                <div className="screenshot-container">
                  {renderItem(item)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ChatGenerator 