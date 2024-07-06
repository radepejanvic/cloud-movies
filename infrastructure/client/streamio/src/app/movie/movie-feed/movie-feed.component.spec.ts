import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieFeedComponent } from './movie-feed.component';

describe('MovieFeedComponent', () => {
  let component: MovieFeedComponent;
  let fixture: ComponentFixture<MovieFeedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MovieFeedComponent]
    });
    fixture = TestBed.createComponent(MovieFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
