# library-swap

`library-swap` is a web app that allows users to request book trades with other
registered users. Inspired by specs at [FreeCodeCamp] and currently hosted at
[shanehughes.io].

#### Features

- Users can browse and search other users' books.
- Users can add books to their collection of offerings.
- Users can request books from each other and offer another book to trade.
- Requests, messages, and updates will show up in the user's inbox.
- Users can accept, reject, or withdraw requests.
- Users can message each other regarding a request.

#### Tech

`library-swap` is powered by Node.js/Express. It used MariaDB/Sequelize for all
persistent storage. Authentication is provided by Passport. Front-end rendering
is through React/React-router with styling by material-ui.

#### License

Copyright 2017 by Shane Hughes. `library-swap` is free software; you can
redistribute it and/or modify it under the terms of the GNU General Public
License as published by the Free Software Foundation; either version 2 of
the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
more details.

A copy of the GPLv2 can be found in the file `COPYING`.

[FreeCodeCamp]: <https://www.freecodecamp.com/challenges/manage-a-book-trading-club>
[shanehughes.io]: <https://libraryswap.shanehughes.io>