require('dotenv').config();

import container from './inversify.config';
import { RhincodonBot } from './rhincodon-bot';


const rhincodon = container.get<RhincodonBot>(RhincodonBot);

rhincodon.start();
