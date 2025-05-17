import React from 'react';
import MainBlock from '../blocks/main-block/MainBlock';
import DownloadBlock from '../blocks/download-block/DownloadBlock';
import PictureBlock from '../blocks/picture-block/PictureBlock';
import './main-page.css';

const MainPage = () => {
  return (
    <div>
      <MainBlock />
      <DownloadBlock />
      <PictureBlock />

    </div>
  );
};

export default MainPage;
