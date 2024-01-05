import processRoute from './process-route.js';
import userRoute from './userRoute.js';
import dynaScreenRoute from './dynaScreen-route.js';
import homeScreenRoute from './homeScreen-route.js';

export default (app) => {
    app.use('/process', processRoute);
    app.use('/user', userRoute);
    app.use('/dynaScreen', dynaScreenRoute);
    app.use('/homeScreen', homeScreenRoute)
} 