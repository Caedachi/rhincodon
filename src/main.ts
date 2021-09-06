require('dotenv').config();

import container from './container';
import { RhincodonBot } from './rhincodon-bot';


const rhincodon = container.get<RhincodonBot>(RhincodonBot);

rhincodon.start();
