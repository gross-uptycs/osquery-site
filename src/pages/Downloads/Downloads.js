import React, { Component } from 'react'
import { withRouter } from 'react-router'

import content from 'data/pages/downloads.json'
import DownloadCard from 'components/DownloadCard'
import Heading1 from 'components/text/Heading1'
import Heading2 from 'components/text/Heading2'
import Heading5 from 'components/text/Heading5'
import Icon from 'components/Icon'
import Monospace from 'components/text/Monospace'
import osqueryVersionsData from 'data/osquery_versions.json'
import OsqueryVersionDropdown from 'components/forms/fields/OsqueryVersionDropdown'
import Paragraph from 'components/text/Paragraph'
import Tab from 'components/Tab'
import Terminal from 'components/terminals/Terminal'
import './Downloads.css'

const baseClass = 'downloads-page'
const installOptionNames = {
  darwin: 'macOS',
  ubuntu: 'Debian Linux',
  centos: 'RPM Linux',
  freebsd: 'Free BSD',
  windows: 'Windows',
}
const installOptionNamesKeys = Object.keys(installOptionNames)
const installOptionNamesValues = Object.values(installOptionNames)

class Downloads extends Component {
  state = {
    selectedInstallOption: 'darwin',
  }

  onInstallOptionChange = installOption => {
    return () => {
      this.setState({ selectedInstallOption: installOption })
    }
  }

  onOsqueryVersionChange = option => {
    if (option) {
      const { history } = this.props

      history.push(`/downloads/${option.value}`)
    }
  }

  renderTerminalBody = () => {
    const { selectedInstallOption } = this.state

    if (selectedInstallOption === 'ubuntu') {
      return (
        <Terminal.Body>
          <Monospace>$ export OSQUERY_KEY=1484120AC4E9F8A1A577AEEE97A80C63C9D8B80B</Monospace>

          <Monospace>
            $ sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys $OSQUERY_KEY
          </Monospace>

          <Monospace>
            $ sudo add-apt-repository {'deb [arch=amd64] https://pkg.osquery.io/deb deb main'}
          </Monospace>

          <Monospace>$ sudo apt-get update</Monospace>

          <Monospace>$ sudo apt-get install osquery</Monospace>
        </Terminal.Body>
      )
    }

    if (selectedInstallOption === 'centos') {
      return (
        <Terminal.Body>
          <Monospace>
            $ curl -L https://pkg.osquery.io/rpm/GPG | sudo tee /etc/pki/rpm-gpg/RPM-GPG-KEY-osquery
          </Monospace>

          <Monospace>
            $ sudo yum-config-manager --add-repo https://pkg.osquery.io/rpm/osquery-s3-rpm.repo
          </Monospace>

          <Monospace>$ sudo yum-config-manager --enable osquery-s3-rpm</Monospace>

          <Monospace>$ sudo yum install osquery</Monospace>
        </Terminal.Body>
      )
    }

    if (selectedInstallOption === 'windows') {
      return (
        <Terminal.Body>
          <Monospace>$ choco install osquery</Monospace>
        </Terminal.Body>
      )
    }

    return (
      <Terminal.Body>
        <Monospace>$ export OSQUERY_KEY=1484120AC4E9F8A1A577AEEE97A80C63C9D8B80B</Monospace>

        <Monospace>
          $ sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys $OSQUERY_KEY
        </Monospace>

        <Monospace>
          $ sudo add-apt-repository {'deb [arch=amd64] https://pkg.osquery.io/deb deb main'}
        </Monospace>

        <Monospace>$ sudo apt-get update</Monospace>

        <Monospace>$ sudo apt-get install osquery</Monospace>
      </Terminal.Body>
    )
  }

  render() {
    const { match } = this.props
    const { onInstallOptionChange, onOsqueryVersionChange, renderTerminalBody } = this
    const { selectedInstallOption } = this.state
    const alternativeInstallOptionContent =
      content.sections.alternativeInstallationOptions.subheadings[selectedInstallOption]
    const selectedOsqueryVersion = match.params.osquery_version
    const downloadsDataForOsqueryVersion = osqueryVersionsData.find(
      data => data.version === selectedOsqueryVersion
    )

    return (
      <div className={`${baseClass}__page-wrapper`}>
        <section className={`${baseClass}__title-section`}>
          <Heading1>{content.sections.hero.sectionHeading}</Heading1>
        </section>

        <div className={`section-break ${baseClass}__section-break`} />

        <section className={`${baseClass}__packages-section`}>
          <Heading2>{content.sections.packages.sectionHeading}</Heading2>
          <Paragraph>{content.sections.packages.sectionSubheading}</Paragraph>
          <Heading5 className={`${baseClass}__osquery-version`}>Osquery Version</Heading5>
          <OsqueryVersionDropdown
            className={`${baseClass}__dropdown`}
            name="dropdown"
            onChange={onOsqueryVersionChange}
            value={selectedOsqueryVersion}
          />

          <div className={`section-break ${baseClass}__section-break`} />

          <div className={`${baseClass}__downloads-wrapper`}>
            {downloadsDataForOsqueryVersion.downloads.map((data, idx) => {
              return (
                <DownloadCard
                  className={`${baseClass}__download-card`}
                  downloadData={data}
                  key={`download-card-${idx}`}
                />
              )
            })}
          </div>
        </section>
        <div className={`section-break ${baseClass}__section-break`} />

        <section className={`${baseClass}__alternative-install-section`}>
          <Heading2>Alternative Install Options</Heading2>

          <div className={`${baseClass}__pill-wrapper`}>
            {installOptionNamesValues.map((installOptionName, idx) => {
              const iconName = installOptionNamesKeys[idx]

              return (
                <Tab
                  active={iconName === selectedInstallOption}
                  className={`${baseClass}__install-pill`}
                  key={`install-option-${idx}`}
                  onClick={onInstallOptionChange(iconName)}
                  text={installOptionName}
                />
              )
            })}
          </div>

          <Icon
            className={`${baseClass}__install-icon`}
            fillColor="#eaeaea"
            name={selectedInstallOption}
          />

          <div>
            <Heading5>{alternativeInstallOptionContent.subSection1Heading}</Heading5>
            <Paragraph>{alternativeInstallOptionContent.subSection1Paragraph1}</Paragraph>
          </div>

          <Terminal.Wrapper className={`${baseClass}__terminal`}>
            {renderTerminalBody()}
          </Terminal.Wrapper>
        </section>
      </div>
    )
  }
}

export default withRouter(Downloads)