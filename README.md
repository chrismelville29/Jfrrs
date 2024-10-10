## Purpose

This app can be used to compare track athletes (only distance events right now). Users can view all athletes from a 
conference sorted by events of their choosing. Users can also select an athlete and conference to see which athletes
from the chosen conference are most similar to the selected athlete.

## To run program

- Run "python3 app.py localhost 5001" in the command line then go to "localhost:5001" in a browser.

## To add new conference

- Navigate to the tfrrs page of the conference you want to add
- The url of the page should look like "https://www.tfrrs.org/leagues/1408.html", (1408 is a placeholder in this case,
the actual value will be the conference id of your conference)
- Run "python3 scraper.py 1408 m" to add the men's side of the conference and "python3 scraper.py 1408 f" for the women's.

## Similarity Methodology
On the athlete comparison page, there is a "similarity" column. Here is an explanation of how that is calculated.

- We want to measure similarity of two athletes $x$ and $y$, which we will call $S(x, y)$.
- A simpler problem is measuring the similarity in event $v$ of their prs $x_v$ and $y_v$, $s(x_v, y_v)$.
    - We can start off with $s(x_v, y_v) = exp(-|x_v-y_v|)$.
    - To standardize across events, we define $s(x_v, y_v) = exp(-\frac{|x_v-y_v|}{\sigma_v})$.
    - Handily, this stays between $0$ and $1$, with $1$ meaning perfect similarity.
- Next, we define the set of all events $x$ and $y$ have both run as $V_{xy}$.
- Averaging all of the $s(x_v, y_v)$ in $V_{xy}$ gives us $S(x, y) = \frac{1}{|V_{xy}|}\sum\limits_{v \in V_{xy}} s(x_v, y_v)$.
- This is a good start, but we would like to judge athletes on their best events.
    - We want $w_v(x, V)$ to be the weight we give event $v$ in some events $V$ run by athlete $x$.
    - Let $z_v(x)$ be the z-score of $x_v$, i.e. $\frac{x_v-\mu_v}{\sigma_v}$
    - Let $z_{min}(x,V)$ be athlete $x$'s lowest z-score of any event in $V$.
    - Then we can define $w_v(x, V) = exp(z_{min}(x, V)-z_v(x))$
    - This weight stays between 0 and 1, with athlete $x$'s best event receiving a score of $1$.
- We can use these weights to redefine $S(x,y) = \frac{\sum\limits_{v \in V_{xy}} s(x_v, y_v)w_v(x, V_{xy})w_v(y, V_{xy})}{\sum\limits_{v \in V_{xy}} w_v(x, V_{xy})w_v(y, V_{xy})}$
- This is better, but similarity metrics will still be too high in some cases like this one:
    - Alice is a 10k runner and Bob is a sprinter and their only shared event is the 800.
    - They have slow but identical times that are worse than their prs in their specialty events.
    - In this case, $S(Alice, Bob)$ will be $s(Alice_{800}, Bob_{800}) = 1$, which is too high.
    - We want high similarities to imply that athletes specialize in the same events.
- Luckily, we can fix this by tweaking the weights used in the numerator of our function.
- We can define $V_x$ as the set of all events run by $x$.
- $w_v(x, V_x)$ then gives an event weight that takes into account everything $x$ has run.
- Incorporating this into our function gives us $S(x,y) = \frac{\sum\limits_{v \in V_{xy}} s(x_v, y_v)w_v(x, V_x)w_v(y, V_y)}{\sum\limits_{v \in V_{xy}} w_v(x, V_{xy})w_v(y, V_{xy})}$.
  