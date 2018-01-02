import browseChildren from './browseChildren';
import {browseFiles, playBrowse} from './browseFiles';
import fileGetInfo from './fileGetInfo';
import playbackInfo from './playbackInfo';
import playbackMute from './playbackMute';
import playbackPlayPause from './playbackPlayPause';
import playbackStop from './playbackStop';
import playbackNext from './playbackNext';
import playbackPosition from './playbackPosition';
import playbackPrevious from './playbackPrevious';
import playbackVolume from './playbackVolume';
import playbackZones from './playbackZones';
import alive from './alive';
import authenticate from './authenticate';

export {
    alive,
    authenticate,
    browseChildren,
    browseFiles,
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
    playbackStop
};

export const PLAY_TYPE_FILE = 'file';
export const PLAY_TYPE_BROWSE = 'browse';