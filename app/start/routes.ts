/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const WordsPoolsController = () => import('#controllers/words_pools_controller')

router.get('/', [WordsPoolsController, 'today'])
router.get('/stats', [WordsPoolsController, 'stats'])
router.get('/history', [WordsPoolsController, 'history'])
router.get('/game/:day', [WordsPoolsController, 'game'])
router.get('/game/:day/details', [WordsPoolsController, 'gameDetails'])
