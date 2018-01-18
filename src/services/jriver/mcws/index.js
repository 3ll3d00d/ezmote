import alive from './alive';
import authenticate from './authenticate';
import browseChildren from './browseChildren';
import {browseFiles, playBrowse} from './browseFiles';
import controlKey from './controlKey';
import fileGetInfo from './fileGetInfo';
import playbackInfo from './playbackInfo';
import playbackMute from './playbackMute';
import playbackPlayPause from './playbackPlayPause';
import playbackStop from './playbackStop';
import playbackStopAll from './playbackStopAll';
import playbackNext from './playbackNext';
import playbackPosition from './playbackPosition';
import playbackPrevious from './playbackPrevious';
import playbackSetZone from './playbackSetZone';
import playbackVolume from './playbackVolume';
import playbackZones from './playbackZones';

export {
    alive,
    authenticate,
    browseChildren,
    browseFiles,
    controlKey,
    fileGetInfo,
    playBrowse,
    playbackInfo,
    playbackMute,
    playbackNext,
    playbackPosition,
    playbackPrevious,
    playbackVolume,
    playbackZones,
    playbackPlayPause,
    playbackSetZone,
    playbackStop,
    playbackStopAll,
};

export const PLAY_TYPE_FILE = 'file';
export const PLAY_TYPE_BROWSE = 'browse';