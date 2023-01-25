import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import 'codemirror/mode/python/python';

import 'codemirror/mode/clike/clike';

import 'codemirror/mode/markdown/markdown';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
