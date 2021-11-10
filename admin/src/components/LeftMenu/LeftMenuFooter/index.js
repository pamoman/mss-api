/**
 *
 * LeftMenuFooter
 *
 */

import React from 'react';
import { PropTypes } from 'prop-types';

import Wrapper from './Wrapper';

function LeftMenuFooter({ version }) {
  // PROJECT_TYPE is an env variable defined in the webpack config
  // eslint-disable-next-line no-undef
  const projectType = PROJECT_TYPE;
  const url = "https://github.com/pamoman/mss-api";

  return (
    <Wrapper>
      <div className="poweredBy">
        <a key="website" href={url} target="_blank" rel="noopener noreferrer">
          PamoSystems
        </a>
        &nbsp;
        <a
          href={url}
          key="github"
          target="_blank"
          rel="noopener noreferrer"
        >
          v{version}
        </a>
        &nbsp;
        <a href={url} target="_blank" rel="noopener noreferrer">
          — {projectType} Edition
        </a>
      </div>
    </Wrapper>
  );
}

LeftMenuFooter.propTypes = {
  version: PropTypes.string.isRequired,
};

export default LeftMenuFooter;
