import { AfterViewInit, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EditorView, basicSetup } from "codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { suite1 } from './tests/suite1';
import { suite2 } from './tests/suite2';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MarkdownPipe } from './markdown.pipe';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';


declare const mocha: any;
declare const window: any;

export interface TestSuite {
  title: string;
  description: string;
  tests: () => void;
  preset: string;
  elapsed: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, MarkdownPipe, MatCardModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  private readonly element = inject(ElementRef);

  @ViewChild('editor')
  private readonly editor!: ElementRef<HTMLElement>;
  @ViewChild('tester')
  private readonly tester!: ElementRef<HTMLElement>;

  protected suites: TestSuite[] = [suite2, suite1];

  protected suiteControl = new FormControl<TestSuite>(this.suites[this.suites.length - 1]);

  private editorView!: EditorView;

  protected failures = signal<number>(0);
  protected syntaxError = signal<boolean>(false);

  protected selectionChange(event: MatSelectChange): void {
    this.setSuite(event.value);
  }

  private setSuite(suite: TestSuite): void {
    this.editorView.dispatch({
      changes: {
        from: 0,
        to: this.editorView.state.doc.length,
        insert: suite.preset
      }
    })
  }

  private setTests(): void {
    this.tester.nativeElement.innerHTML = '';
    setTimeout(() => {
      mocha.unloadFiles();
      mocha.suite.suites = [];

      this.suiteControl.value!.tests();
      mocha.cleanReferencesAfterRun();
      mocha.run(
        (failures: any) => this.failures.set(failures)
      );
    }, 100);

  }

  constructor() {
    window.test = window.unitjs;
    mocha.setup('bdd');
  }

  public ngAfterViewInit(): void {
    let updateListenerExtension = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const func = this.editorView.state.doc.toString();

        try {
          (0, eval)(func);
          this.setTests();
          this.syntaxError.set(false);
        } catch (e: any) {
          this.syntaxError.set(true);
          this.tester.nativeElement.innerHTML = `<div class="syntax-error">${e.toString()}</div>`;
        }

      }
    });

    this.editorView = new EditorView({
      extensions: [basicSetup, javascript(), updateListenerExtension],
      parent: this.editor.nativeElement,
    });

    this.setSuite(this.suiteControl.value!);
  }

  private provideMailText(suite: TestSuite) {
    const subject = encodeURIComponent(`Code-Challenge ${suite.title}`);
    const body = encodeURIComponent(`Meine Lösung\n\n${this.editorView.state.doc.toString()}`);
    return `subject=${subject}&body=${body}`;
  }

  protected provide() {
    const a = document.createElement('a');
    a.href = `mailto: test@test.de?${this.provideMailText(this.suiteControl.value!)}`;
    a.click();
  }
}
