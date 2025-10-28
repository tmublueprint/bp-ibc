import './TextSettingStyle.css'

function TextSettingPopupUIComponent() {
  return (
    <div id="text-setting-popup-ui-component" className="text-setting-popup-ui-component">
        <div>
            <h2>Text Settings</h2>
            <hr></hr>
        </div>
        <div className='text-setting-popup-ui-component-section'>
            <div>
              Style
            </div>
            <hr></hr>
            <div>
              Font
            </div>
            <hr></hr>
            <div>
              Font Size (px)
            </div>
            <hr></hr>
            <div>
              <ul>
                <li>
                  <button>B</button>
                </li>
                <li>
                  <button>I</button>
                </li>
                <li>
                  <button>U</button>
                </li>
              </ul>
            </div>
            <hr></hr>
            <div>Alignment</div>
        </div>
    </div>
  );
}

export default TextSettingPopupUIComponent;