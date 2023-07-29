import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <div class="site-wrapper">
      <div class="main">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class AppComponent {}
