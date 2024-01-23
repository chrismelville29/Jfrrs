
\begin{itemize}
    \item We want to measure similarity of two athletes $x$ and $y$, which we will call $S(x, y)$.
    \item A simpler problem is measuring the similarity in event $v$ of their prs $x_v$ and $y_v$, $s(x_v, y_v)$.
    \begin{itemize}
        \item We can start off with $s(x_v, y_v) = exp(-|x_v-y_v|)$.
        \item To standardize across events, we define $s(x_v, y_v) = exp(-\frac{|x_v-y_v|}{\sigma_v})$.
        \item Handily, this stays between $0$ and $1$, with $1$ meaning perfect similarity.
    \end{itemize}
    \item Next, we define the set of all events $x$ and $y$ have both run as $V^{xy}$.
    \item Averaging all of the $s(x_v, y_v)$ in $V_{xy}$ gives us $S(x, y) = \frac{1}{|V_{xy}|}\sum\limits_{v \in V_{xy}} s(x_v, y_v)$.
    \item A good start, but we would like to judge athletes on their best events.
    \begin{itemize}
        \item We want $w_v(x, V)$ to be the weight we give event $v$ in some events $V$ run by athlete $x$.
        \item Let $z_v(x)$ be the z-score of $x_v$, i.e. $\frac{x_v-\mu_v}{\sigma_v}$
        \item Let $z_{min}(x,V)$ be athlete $x$'s lowest z-score of any event in $V$.
        \item Then we can define $w_v(x, V) = exp(z_{min}(x, V)-z_v(x))$
        \item This weight stays between 0 and 1, with athlete $x$'s best event receiving a score of $1$.
    \end{itemize}
    \item We can use these weights to redefine $S(x,y) = \frac{\sum\limits_{v \in V_{xy}} s(x_v, y_v)w_v(x, V_{xy})w_v(y, V_{xy})}{\sum\limits_{v \in V_{xy}} w_v(x, V_{xy})w_v(y, V_{xy})}$
    \item This is better, but similarity metrics will still be too high in some cases like this one:
    \begin{itemize}
        \item Alice is a 10k runner and Bob is a sprinter and their only shared event is the 800.
        \item They have slow but identical times that are worse than their prs in their specialty events.
        \item In this case, $S(Alice, Bob)$ will be $s(Alice_{800}, Bob_{800}) = 1$, which is too high.
        \item We want high similarities to imply that athletes specialize in the same events.
    \end{itemize}
    \item Luckily, we can fix this by tweaking the weights used in the numerator of our function.
    \item We can define $V_x$ as the set of all events run by $x$.
    \item $w_v(x, V_x)$ then gives an event weight that takes into account everything $x$ has run.
    \item Incorporating this into our function gives us $S(x,y) = \frac{\sum\limits_{v \in V_{xy}} s(x_v, y_v)w_v(x, V_x)w_v(y, V_y)}{\sum\limits_{v \in V_{xy}} w_v(x, V_{xy})w_v(y, V_{xy})}$.
    
    
\end{itemize}