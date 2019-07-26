import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Editor from './Editor'
import { Dimmer, Loader } from 'semantic-ui-react'
import { SemanticToastContainer } from 'react-semantic-toasts'
import { createMuiTheme } from '@material-ui/core/styles'
import Screen from './screen'
import FolderListing from './folderListing'
import FileEntry from './fileEntry'

import 'react-semantic-toasts/styles/react-semantic-alert.css'
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/default.css';

import keymap from './keymap'
// @ts-ignore
import { ShortcutManager } from 'react-shortcuts'
import { ThemeProvider } from '@material-ui/styles';
import { CategoryType } from './sidebar';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

@inject('store') @observer
class App extends Component {
  static childContextTypes = {
    shortcuts: PropTypes.object.isRequired
  }
  componentDidMount() {
    this.props.store.getFiles()
  }
  getChildContext() {
    const shortcutManager = new ShortcutManager(keymap)
    return { shortcuts: shortcutManager }
  }
  render() {
    const { store } = this.props
    const view = (screen => {
      switch (screen) {
        case 'online':
          const onFileOpen = (fileId, version) => store.selectFile(fileId, version)

          let innerView = {}
          let mainContent
          if (store.file) {
            mainContent = (
              <div>
                <Editor />
              </div>
            )
          } else {
            const files = store.files
            const folderListing = Object.keys(files).map(fileId => {
              const latestEntry = files[fileId][0]
              return {
                id: fileId,
                version: 0,
                title: latestEntry.stored.name
              }
            })

            const fileEntries = folderListing.map(f => {
              return (<FileEntry key={f.id} {...f} onClick={onFileOpen} />)
            })

            mainContent = (
              <FolderListing>
                {fileEntries}
              </FolderListing>
            )
          }

          innerView = (
            <Screen
              avatarImage={undefined}
              categories={[
                {
                  label: 'Home',
                  type: CategoryType.NOTES
                },
                {
                  label: 'Trash',
                  type: CategoryType.TRASH
                }
              ]}
              onOpenGroup={() => store.clearFile()}
              onCreateGroup={() => { console.log('on create group') }}
              onFileOpen={onFileOpen}
              onAddFile={() => store.setFile("<p>Create your article here...</p>")}>
              {mainContent}
            </Screen>
          )

          return (
            <div style={{ width: '80%', maxWidth: '800px', margin: '1em auto' }}>
              {innerView}
              <Dimmer active={store.isLoading} inverted>
                <Loader size='massive'></Loader>
              </Dimmer>
            </div>
          )
        default:
          return (
            <Dimmer active={store.status === 'offline'}>
              <Loader size='massive'></Loader>
            </Dimmer>
          )
      }
    })(store.status)
    return (
      <div className='App'>
        <ThemeProvider theme={theme}>
          {view}
        </ThemeProvider>
        <SemanticToastContainer />
      </div>
    )
  }
}

export default App
